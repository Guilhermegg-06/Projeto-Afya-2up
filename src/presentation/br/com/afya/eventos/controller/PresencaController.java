package br.com.afya.eventos.controller;

import br.com.afya.eventos.dto.ApiDtos.PresencaRequest;
import br.com.afya.eventos.dto.ApiDtos.PresencaResponse;
import br.com.afya.eventos.service.CatalogoAcademicoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PresencaController {

    private final CatalogoAcademicoService service;

    public PresencaController(CatalogoAcademicoService service) {
        this.service = service;
    }

    @PostMapping("/presencas")
    public ResponseEntity<PresencaResponse> registrarPresenca(@RequestBody PresencaRequest request) {
        return ResponseEntity.ok(service.registrarPresenca(request));
    }
}
