package br.com.afya.eventos.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(Environment environment) {
        String rawUrl = firstValid(
                environment.getProperty("SPRING_DATASOURCE_URL"),
                environment.getProperty("spring.datasource.url")
        );

        if (rawUrl == null) {
            throw new IllegalStateException("SPRING_DATASOURCE_URL nao configurada");
        }

        DatabaseUrl databaseUrl = normalize(rawUrl);

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(databaseUrl.jdbcUrl());
        dataSource.setUsername(firstValid(
                environment.getProperty("SPRING_DATASOURCE_USERNAME"),
                environment.getProperty("spring.datasource.username"),
                databaseUrl.username()
        ));
        dataSource.setPassword(firstValid(
                environment.getProperty("SPRING_DATASOURCE_PASSWORD"),
                environment.getProperty("spring.datasource.password"),
                databaseUrl.password()
        ));
        return dataSource;
    }

    private DatabaseUrl normalize(String rawUrl) {
        if (rawUrl.startsWith("jdbc:")) {
            return new DatabaseUrl(rawUrl, null, null);
        }

        if (!rawUrl.startsWith("postgresql://") && !rawUrl.startsWith("postgres://")) {
            throw new IllegalStateException("URL do banco deve usar jdbc:, postgresql:// ou postgres://");
        }

        URI uri = URI.create(rawUrl);
        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                .append(uri.getHost());

        if (uri.getPort() > 0) {
            jdbcUrl.append(":").append(uri.getPort());
        }

        jdbcUrl.append(uri.getPath() == null || uri.getPath().isBlank() ? "/postgres" : uri.getPath());

        if (uri.getRawQuery() == null || uri.getRawQuery().isBlank()) {
            jdbcUrl.append("?sslmode=require");
        } else {
            jdbcUrl.append("?").append(uri.getRawQuery());
        }

        String username = null;
        String password = null;
        String userInfo = uri.getRawUserInfo();
        if (userInfo != null && !userInfo.isBlank()) {
            String[] credentials = userInfo.split(":", 2);
            username = decode(credentials[0]);
            if (credentials.length > 1) {
                password = decode(credentials[1]);
            }
        }

        return new DatabaseUrl(jdbcUrl.toString(), username, password);
    }

    private String firstValid(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank() && !value.startsWith("${")) {
                return value.trim();
            }
        }
        return null;
    }

    private String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private record DatabaseUrl(String jdbcUrl, String username, String password) {
    }
}
