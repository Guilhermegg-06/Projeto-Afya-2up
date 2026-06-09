package br.com.afya.eventos.service;

import br.com.afya.eventos.model.CertificadoEntity;
import br.com.afya.eventos.model.ParticipanteEntity;
import br.com.afya.eventos.repository.CertificadoRepository;
import br.com.afya.eventos.repository.ParticipanteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class CertificadoImagemService {

    private final CertificadoRepository certificadoRepository;
    private final ParticipanteRepository participanteRepository;

    public CertificadoImagemService(
            CertificadoRepository certificadoRepository,
            ParticipanteRepository participanteRepository
    ) {
        this.certificadoRepository = certificadoRepository;
        this.participanteRepository = participanteRepository;
    }

    @Transactional(readOnly = true)
    public byte[] gerarImagemPorCodigo(String codigo) {
        CertificadoEntity certificado = certificadoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "certificado nao encontrado"));
        ParticipanteEntity participante = participanteRepository.findById(certificado.getAlunoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "aluno nao encontrado"));

        return desenharCertificado(
                participante.getNome(),
                certificado.getAtividade().getTitulo(),
                certificado.getCodigo()
        );
    }

    private byte[] desenharCertificado(String nomeAluno, String nomeCurso, String codigo) {
        BufferedImage image = new BufferedImage(1200, 800, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        g.setColor(new Color(248, 250, 252));
        g.fillRect(0, 0, 1200, 800);

        g.setColor(new Color(8, 24, 58));
        g.fillRect(0, 0, 1200, 120);

        g.setColor(new Color(13, 44, 96));
        g.setStroke(new BasicStroke(10));
        g.drawRect(55, 165, 1090, 555);

        g.setColor(new Color(8, 24, 58));
        drawCentered(g, "AMRY Cursos", new Font("Serif", Font.BOLD, 44), 600, 78);

        g.setColor(new Color(13, 44, 96));
        drawCentered(g, "CERTIFICADO DE CONCLUSAO", new Font("Serif", Font.BOLD, 42), 600, 250);

        g.setColor(new Color(50, 62, 80));
        drawCentered(g, "Parabens,", new Font("SansSerif", Font.PLAIN, 30), 600, 330);

        g.setColor(new Color(9, 31, 68));
        drawCentered(g, nomeAluno, new Font("Serif", Font.BOLD, 54), 600, 405);

        g.setColor(new Color(50, 62, 80));
        drawCentered(g, "voce concluiu a atividade:", new Font("SansSerif", Font.PLAIN, 28), 600, 475);

        g.setColor(new Color(9, 31, 68));
        drawCentered(g, nomeCurso, new Font("Serif", Font.BOLD, 38), 600, 535);

        g.setColor(new Color(50, 62, 80));
        drawCentered(g, "Codigo de validacao: " + codigo, new Font("Monospaced", Font.PLAIN, 22), 600, 640);

        g.setColor(new Color(8, 24, 58));
        g.fillRect(420, 675, 360, 4);
        drawCentered(g, "Coordenacao Academica", new Font("SansSerif", Font.PLAIN, 20), 600, 715);

        g.dispose();

        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            ImageIO.write(image, "png", output);
            return output.toByteArray();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "erro ao gerar imagem do certificado");
        }
    }

    private void drawCentered(Graphics2D g, String text, Font font, int centerX, int y) {
        g.setFont(font);
        FontMetrics metrics = g.getFontMetrics();
        int x = centerX - metrics.stringWidth(text) / 2;
        g.drawString(text, x, y);
    }
}
