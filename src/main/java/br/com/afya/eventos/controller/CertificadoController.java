package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.ApiDtos.CertificadoGerarRequest;
import br.com.afya.eventos.dto.ApiDtos.CertificadoResponse;
import br.com.afya.eventos.service.CatalogoAcademicoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CertificadoController {

    private final CatalogoAcademicoService service;

    public CertificadoController(CatalogoAcademicoService service) {
        this.service = service;
    }

    @PostMapping("/certificados/gerar")
    public ResponseEntity<CertificadoResponse> gerarCertificado(@RequestBody CertificadoGerarRequest request) {
        CertificadoResponse gerado = service.gerarCertificado(request);
        return ResponseEntity.created(URI.create("/api/certificados/validar/" + gerado.codigo())).body(gerado);
    }

    @GetMapping("/certificados/validar/{codigo}")
    public ResponseEntity<CertificadoResponse> validarCertificado(@PathVariable String codigo) {
        CertificadoResponse certificado = service.validarCertificado(codigo);
        return ResponseEntity.ok(certificado);
    }

    @GetMapping("/alunos/{alunoId}/certificados")
    public List<CertificadoResponse> listarCertificadosDoAluno(@PathVariable Long alunoId) {
        return service.listarCertificadosDoAluno(alunoId);
    }
}
