package br.com.afya.eventos.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class SupabaseDatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String explicitDatasourceUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        String datasourceUrl = explicitDatasourceUrl;
        if (datasourceUrl == null || datasourceUrl.isBlank()) {
            datasourceUrl = environment.getProperty("spring.datasource.url");
        }

        Map<String, Object> overrides = normalizePostgresUrl(datasourceUrl, environment);
        configureDialect(overrides, datasourceUrl, explicitDatasourceUrl);
        if (!overrides.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource("supabaseDatabaseUrl", overrides));
        }
    }

    private void configureDialect(Map<String, Object> overrides, String datasourceUrl, String explicitDatasourceUrl) {
        if (datasourceUrl == null || datasourceUrl.isBlank()) {
            return;
        }

        if (datasourceUrl.startsWith("jdbc:h2:") && (explicitDatasourceUrl == null || explicitDatasourceUrl.isBlank())) {
            overrides.put("spring.jpa.database-platform", "org.hibernate.dialect.H2Dialect");
            return;
        }

        if (datasourceUrl.startsWith("jdbc:postgresql:")
                || datasourceUrl.startsWith("postgresql://")
                || datasourceUrl.startsWith("postgres://")) {
            overrides.put("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");
        }
    }

    private Map<String, Object> normalizePostgresUrl(String datasourceUrl, ConfigurableEnvironment environment) {
        Map<String, Object> overrides = new HashMap<>();

        if (datasourceUrl == null || datasourceUrl.isBlank() || datasourceUrl.startsWith("jdbc:")) {
            return overrides;
        }

        if (!datasourceUrl.startsWith("postgresql://") && !datasourceUrl.startsWith("postgres://")) {
            return overrides;
        }

        URI uri = URI.create(datasourceUrl);
        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                .append(uri.getHost());

        if (uri.getPort() > 0) {
            jdbcUrl.append(":").append(uri.getPort());
        }

        jdbcUrl.append(uri.getPath() == null || uri.getPath().isBlank() ? "/postgres" : uri.getPath());

        if (uri.getRawQuery() != null && !uri.getRawQuery().isBlank()) {
            jdbcUrl.append("?").append(uri.getRawQuery());
        } else {
            jdbcUrl.append("?sslmode=require");
        }

        overrides.put("spring.datasource.url", jdbcUrl.toString());

        String userInfo = uri.getRawUserInfo();
        if (userInfo != null && !userInfo.isBlank()) {
            String[] credentials = userInfo.split(":", 2);
            putUrlCredentialIfEnvironmentMissing(
                    overrides,
                    environment,
                    "spring.datasource.username",
                    "SPRING_DATASOURCE_USERNAME",
                    credentials[0]
            );

            if (credentials.length > 1) {
                putUrlCredentialIfEnvironmentMissing(
                        overrides,
                        environment,
                        "spring.datasource.password",
                        "SPRING_DATASOURCE_PASSWORD",
                        credentials[1]
                );
            }
        }

        return overrides;
    }

    private void putUrlCredentialIfEnvironmentMissing(
            Map<String, Object> overrides,
            ConfigurableEnvironment environment,
            String propertyName,
            String environmentName,
            String value
    ) {
        String explicitEnvironmentValue = environment.getProperty(environmentName);
        if ((explicitEnvironmentValue == null || explicitEnvironmentValue.isBlank())
                && value != null
                && !value.isBlank()) {
            overrides.put(propertyName, URLDecoder.decode(value, StandardCharsets.UTF_8));
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 10;
    }
}
