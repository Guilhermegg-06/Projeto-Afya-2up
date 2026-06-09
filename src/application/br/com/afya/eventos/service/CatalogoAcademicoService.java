package br.com.afya.eventos.service;

import br.com.afya.eventos.dto.ApiDtos.AtividadeRequest;
import br.com.afya.eventos.dto.ApiDtos.AtividadeResponse;
import br.com.afya.eventos.dto.ApiDtos.CertificadoGerarRequest;
import br.com.afya.eventos.dto.ApiDtos.CertificadoResponse;
import br.com.afya.eventos.dto.ApiDtos.CursoRequest;
import br.com.afya.eventos.dto.ApiDtos.CursoResponse;
import br.com.afya.eventos.dto.ApiDtos.EventoRequest;
import br.com.afya.eventos.dto.ApiDtos.EventoResponse;
import br.com.afya.eventos.dto.ApiDtos.InscricaoRequest;
import br.com.afya.eventos.dto.ApiDtos.InscricaoResponse;
import br.com.afya.eventos.dto.ApiDtos.PresencaRequest;
import br.com.afya.eventos.dto.ApiDtos.PresencaResponse;
import br.com.afya.eventos.model.AtividadeEntity;
import br.com.afya.eventos.model.CertificadoEntity;
import br.com.afya.eventos.model.CoordenadorEntity;
import br.com.afya.eventos.model.EventoEntity;
import br.com.afya.eventos.model.InscricaoEntity;
import br.com.afya.eventos.model.ParticipanteEntity;
import br.com.afya.eventos.model.PresencaEntity;
import br.com.afya.eventos.repository.AtividadeRepository;
import br.com.afya.eventos.repository.CertificadoRepository;
import br.com.afya.eventos.repository.CoordenadorRepository;
import br.com.afya.eventos.repository.EventoRepository;
import br.com.afya.eventos.repository.InscricaoRepository;
import br.com.afya.eventos.repository.ParticipanteRepository;
import br.com.afya.eventos.repository.PresencaRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CatalogoAcademicoService {

    private final EventoRepository eventoRepository;
    private final AtividadeRepository atividadeRepository;
    private final InscricaoRepository inscricaoRepository;
    private final PresencaRepository presencaRepository;
    private final CertificadoRepository certificadoRepository;
    private final ParticipanteRepository participanteRepository;
    private final CoordenadorRepository coordenadorRepository;
    private final SenhaService senhaService;

    public CatalogoAcademicoService(
            EventoRepository eventoRepository,
            AtividadeRepository atividadeRepository,
            InscricaoRepository inscricaoRepository,
            PresencaRepository presencaRepository,
            CertificadoRepository certificadoRepository,
            ParticipanteRepository participanteRepository,
            CoordenadorRepository coordenadorRepository,
            SenhaService senhaService
    ) {
        this.eventoRepository = eventoRepository;
        this.atividadeRepository = atividadeRepository;
        this.inscricaoRepository = inscricaoRepository;
        this.presencaRepository = presencaRepository;
        this.certificadoRepository = certificadoRepository;
        this.participanteRepository = participanteRepository;
        this.coordenadorRepository = coordenadorRepository;
        this.senhaService = senhaService;
    }

    @Transactional(readOnly = true)
    public List<EventoResponse> listarEventos() {
        return eventoRepository.findAll().stream()
                .map(this::toEventoResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventoResponse buscarEvento(Long id) {
        return eventoRepository.findById(id)
                .map(this::toEventoResponse)
                .orElse(null);
    }

    @Transactional
    public EventoResponse criarEvento(EventoRequest request) {
        CoordenadorEntity coordenador = garantirCoordenadorPadrao();
        EventoEntity evento = new EventoEntity(
                orDefault(request.titulo(), "Novo evento"),
                orDefault(request.descricao(), ""),
                parseDate(request.dataInicio(), LocalDate.now()),
                parseDate(request.dataFim(), parseDate(request.dataInicio(), LocalDate.now())),
                orDefault(request.local(), "Local nao informado"),
                request.capacidade() == null ? 0 : request.capacidade(),
                orDefault(request.status(), "Inscricoes abertas"),
                request.etiquetas() == null ? List.of() : request.etiquetas()
        );
        evento.definirCoordenadorId(coordenador.getId());
        return toEventoResponse(eventoRepository.save(evento));
    }

    @Transactional
    public EventoResponse atualizarEvento(Long id, EventoRequest request) {
        EventoEntity evento = exigirEvento(id);
        evento.atualizar(
                orDefault(request.titulo(), evento.getTitulo()),
                orDefault(request.descricao(), evento.getDescricao()),
                parseDate(request.dataInicio(), evento.getDataInicio()),
                parseDate(request.dataFim(), evento.getDataFim()),
                orDefault(request.local(), evento.getLocal()),
                request.capacidade() == null ? evento.getCapacidade() : request.capacidade(),
                orDefault(request.status(), evento.getStatus()),
                request.etiquetas() == null ? List.copyOf(evento.getEtiquetas()) : request.etiquetas()
        );
        return toEventoResponse(evento);
    }

    @Transactional
    public void deletarEvento(Long id) {
        EventoEntity evento = exigirEvento(id);
        listarAtividadesDoEvento(id).forEach(atividade -> deletarAtividade(atividade.id()));
        eventoRepository.delete(evento);
    }

    @Transactional(readOnly = true)
    public List<AtividadeResponse> listarAtividadesDoEvento(Long eventoId) {
        exigirEvento(eventoId);
        return atividadeRepository.findByEvento_Id(eventoId).stream()
                .map(this::toAtividadeResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AtividadeResponse buscarAtividade(Long id) {
        return atividadeRepository.findById(id)
                .map(this::toAtividadeResponse)
                .orElse(null);
    }

    @Transactional
    public AtividadeResponse criarAtividade(Long eventoId, AtividadeRequest request) {
        EventoEntity evento = exigirEvento(eventoId);
        AtividadeEntity atividade = new AtividadeEntity(
                evento,
                orDefault(request.titulo(), "Nova atividade"),
                orDefault(request.descricao(), ""),
                orDefault(request.palestrante(), "Palestrante nao informado"),
                request.vagas() == null ? 0 : request.vagas(),
                orDefault(request.horario(), "Horario a definir"),
                orDefault(request.tipo(), "Atividade"),
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(1)
        );
        return toAtividadeResponse(atividadeRepository.save(atividade));
    }

    @Transactional
    public AtividadeResponse atualizarAtividade(Long id, AtividadeRequest request) {
        AtividadeEntity atividade = exigirAtividade(id);
        atividade.atualizar(
                orDefault(request.titulo(), atividade.getTitulo()),
                orDefault(request.descricao(), atividade.getDescricao()),
                orDefault(request.palestrante(), atividade.getPalestrante()),
                request.vagas() == null ? atividade.getVagas() : request.vagas(),
                orDefault(request.horario(), atividade.getHorario()),
                orDefault(request.tipo(), atividade.getTipo())
        );
        return toAtividadeResponse(atividade);
    }

    @Transactional
    public void deletarAtividade(Long id) {
        AtividadeEntity atividade = exigirAtividade(id);
        List<InscricaoEntity> inscricoes = inscricaoRepository.findByAtividade_Id(id);
        inscricoes.forEach(inscricao -> {
            presencaRepository.findByInscricao_Id(inscricao.getId()).ifPresent(presencaRepository::delete);
            certificadoRepository.findByAlunoIdAndAtividade_Id(inscricao.getAlunoId(), id).ifPresent(certificadoRepository::delete);
            inscricaoRepository.delete(inscricao);
        });
        atividadeRepository.delete(atividade);
    }

    @Transactional(readOnly = true)
    public List<CursoResponse> listarCursos() {
        return atividadeRepository.findAll().stream()
                .map(this::toCursoResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CursoResponse buscarCurso(Long id) {
        return atividadeRepository.findById(id)
                .map(this::toCursoResponse)
                .orElse(null);
    }

    @Transactional
    public CursoResponse criarCurso(CursoRequest request) {
        EventoEntity catalogo = garantirCatalogoDeCursos();
        AtividadeEntity curso = new AtividadeEntity(
                catalogo,
                orDefault(request.titulo(), "Novo curso"),
                orDefault(request.descricao(), ""),
                orDefault(request.instrutor(), "Instrutor nao informado"),
                request.vagas() == null ? 0 : request.vagas(),
                orDefault(request.horario(), "Horario a definir"),
                "Curso",
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(1)
        );
        return toCursoResponse(atividadeRepository.save(curso));
    }

    @Transactional
    public CursoResponse atualizarCurso(Long id, CursoRequest request) {
        AtividadeEntity curso = exigirAtividade(id);
        curso.atualizar(
                orDefault(request.titulo(), curso.getTitulo()),
                orDefault(request.descricao(), curso.getDescricao()),
                orDefault(request.instrutor(), curso.getPalestrante()),
                request.vagas() == null ? curso.getVagas() : request.vagas(),
                orDefault(request.horario(), curso.getHorario()),
                "Curso"
        );
        return toCursoResponse(curso);
    }

    @Transactional
    public void deletarCurso(Long id) {
        deletarAtividade(id);
    }

    @Transactional
    public InscricaoResponse criarInscricao(InscricaoRequest request) {
        if (request.alunoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "alunoId e obrigatorio");
        }
        Long cursoId = resolverCursoId(request.atividadeId(), request.cursoId());

        AtividadeEntity atividade = atividadeRepository.findByIdForUpdate(cursoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "curso nao encontrado"));
        Long eventoId = request.eventoId() == null ? atividade.getEvento().getId() : request.eventoId();

        if (!atividade.getEvento().getId().equals(eventoId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "curso nao pertence ao catalogo informado");
        }
        if (inscricaoRepository.existsByAlunoIdAndAtividade_Id(request.alunoId(), cursoId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "inscricao ja existe");
        }

        garantirParticipante(request.alunoId());
        try {
            atividade.ocuparVaga();
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }

        InscricaoEntity inscricao = inscricaoRepository.save(new InscricaoEntity(request.alunoId(), atividade));
        return toInscricaoResponse(inscricao);
    }

    @Transactional(readOnly = true)
    public List<InscricaoResponse> listarInscricoesDoAluno(Long alunoId) {
        return inscricaoRepository.findByAlunoId(alunoId).stream()
                .map(this::toInscricaoResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InscricaoResponse> listarInscricoesDaAtividade(Long atividadeId) {
        return inscricaoRepository.findByAtividade_Id(atividadeId).stream()
                .map(this::toInscricaoResponse)
                .toList();
    }

    @Transactional
    public void deletarInscricao(Long id) {
        InscricaoEntity inscricao = inscricaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "inscricao nao encontrada"));
        AtividadeEntity atividade = atividadeRepository.findByIdForUpdate(inscricao.getAtividade().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "curso nao encontrado"));

        presencaRepository.findByInscricao_Id(id).ifPresent(presencaRepository::delete);
        certificadoRepository.findByAlunoIdAndAtividade_Id(inscricao.getAlunoId(), atividade.getId()).ifPresent(certificadoRepository::delete);
        inscricaoRepository.delete(inscricao);
        atividade.liberarVaga();
    }

    @Transactional
    public PresencaResponse registrarPresenca(PresencaRequest request) {
        Long cursoId = resolverCursoId(request.atividadeId(), request.cursoId());
        if (request.inscricaoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "inscricaoId e obrigatorio");
        }

        InscricaoEntity inscricao = inscricaoRepository.findById(request.inscricaoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "inscricao nao encontrada"));
        if (!inscricao.getAtividade().getId().equals(cursoId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "inscricao nao pertence ao curso informado");
        }

        Boolean presente = request.presente() == null ? Boolean.TRUE : request.presente();

        PresencaEntity presenca = presencaRepository.findByInscricao_Id(inscricao.getId())
                .map(existente -> {
                    existente.atualizar(presente);
                    return existente;
                })
                .orElseGet(() -> presencaRepository.save(new PresencaEntity(inscricao, presente)));
        inscricao.atualizarPresenca(presente);
        return toPresencaResponse(presenca);
    }

    @Transactional(readOnly = true)
    public List<PresencaResponse> listarPresencasDaAtividade(Long atividadeId) {
        return presencaRepository.findByInscricao_Atividade_Id(atividadeId).stream()
                .map(this::toPresencaResponse)
                .toList();
    }

    @Transactional
    public CertificadoResponse gerarCertificado(CertificadoGerarRequest request) {
        Long cursoId = resolverCursoId(request.atividadeId(), request.cursoId());
        if (request.alunoId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "alunoId e obrigatorio");
        }

        AtividadeEntity atividade = exigirAtividade(cursoId);
        Long eventoId = request.eventoId() == null ? atividade.getEvento().getId() : request.eventoId();
        if (!atividade.getEvento().getId().equals(eventoId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "curso nao pertence ao catalogo informado");
        }

        InscricaoEntity inscricao = inscricaoRepository.findByAlunoIdAndAtividade_Id(request.alunoId(), cursoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "inscricao nao encontrada"));
        if (!presencaRepository.existsByInscricao_IdAndPresenteTrue(inscricao.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "presenca ainda nao confirmada");
        }

        CertificadoEntity certificado = certificadoRepository.findByAlunoIdAndAtividade_Id(request.alunoId(), cursoId)
                .orElseGet(() -> certificadoRepository.save(new CertificadoEntity(
                        request.alunoId(),
                        atividade,
                        String.format("CERT-2026-%03d-%03d", request.alunoId(), atividade.getId())
                )));
        return toCertificadoResponse(certificado);
    }

    @Transactional(readOnly = true)
    public List<CertificadoResponse> listarCertificadosDoAluno(Long alunoId) {
        return certificadoRepository.findByAlunoId(alunoId).stream()
                .map(this::toCertificadoResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CertificadoResponse validarCertificado(String codigo) {
        return certificadoRepository.findByCodigo(codigo)
                .map(this::toCertificadoResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "certificado nao encontrado"));
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        CoordenadorEntity coordenador = garantirCoordenadorPadrao();
        garantirParticipante(1L);

        if (eventoRepository.count() > 0) {
            return;
        }

        EventoEntity evento1 = new EventoEntity(
                "Semana Academica de Computacao",
                "Uma experiencia completa com palestras, minicursos e oficinas.",
                LocalDate.of(2026, 6, 20),
                LocalDate.of(2026, 6, 24),
                "Auditorio Central e Laboratorios de Tecnologia",
                240,
                "Inscricoes abertas",
                List.of("Presencial", "Certificado automatico", "Vagas limitadas")
        );
        evento1.definirCoordenadorId(coordenador.getId());
        evento1 = eventoRepository.save(evento1);

        EventoEntity evento2 = new EventoEntity(
                "Workshop de Java e Spring Boot",
                "Atividade pratica sobre backend com Java.",
                LocalDate.of(2026, 6, 25),
                LocalDate.of(2026, 6, 25),
                "Laboratorio 03",
                20,
                "Inscricoes abertas",
                List.of("Minicurso", "Backend")
        );
        evento2.definirCoordenadorId(coordenador.getId());
        evento2 = eventoRepository.save(evento2);

        EventoEntity evento3 = new EventoEntity(
                "Palestra: Carreira em Tecnologia",
                "Conversa sobre carreira e empregabilidade.",
                LocalDate.of(2026, 6, 28),
                LocalDate.of(2026, 6, 28),
                "Sala Magna",
                80,
                "Inscricoes abertas",
                List.of("Palestra", "Networking")
        );
        evento3.definirCoordenadorId(coordenador.getId());
        eventoRepository.save(evento3);

        atividadeRepository.save(new AtividadeEntity(evento1, "Palestra: Carreira em Tecnologia",
                "Evento com visao de mercado e trajetorias profissionais.", "Prof. Joao Silva", 40,
                "19h as 21h", "Palestra", LocalDateTime.of(2026, 6, 20, 19, 0), LocalDateTime.of(2026, 6, 20, 21, 0)));
        atividadeRepository.save(new AtividadeEntity(evento1, "Minicurso: Introducao ao Spring Boot",
                "Atividade pratica sobre backend com Java.", "Profa. Maria Souza", 20,
                "14h as 18h", "Minicurso", LocalDateTime.of(2026, 6, 21, 14, 0), LocalDateTime.of(2026, 6, 21, 18, 0)));
        atividadeRepository.save(new AtividadeEntity(evento2, "Introducao ao Spring Boot",
                "Conteudo intensivo para iniciantes.", "Equipe Java", 20,
                "14h as 18h", "Minicurso", LocalDateTime.of(2026, 6, 25, 14, 0), LocalDateTime.of(2026, 6, 25, 18, 0)));
    }

    private EventoEntity exigirEvento(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "evento nao encontrado"));
    }

    private AtividadeEntity exigirAtividade(Long id) {
        return atividadeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "curso nao encontrado"));
    }

    private EventoResponse toEventoResponse(EventoEntity evento) {
        int totalInscricoes = atividadeRepository.findByEvento_Id(evento.getId()).stream()
                .mapToInt(AtividadeEntity::getOcupadas)
                .sum();
        int capacidade = evento.getCapacidade() == null ? 0 : evento.getCapacidade();
        int ocupacao = capacidade <= 0 ? 0 : (int) Math.round((totalInscricoes * 100.0) / capacidade);

        return new EventoResponse(
                evento.getId(),
                evento.getTitulo(),
                evento.getDescricao(),
                evento.getDataInicio().toString(),
                evento.getDataFim().toString(),
                evento.getLocal(),
                capacidade,
                evento.getStatus(),
                ocupacao,
                List.copyOf(evento.getEtiquetas())
        );
    }

    private AtividadeResponse toAtividadeResponse(AtividadeEntity atividade) {
        return new AtividadeResponse(
                atividade.getId(),
                atividade.getEvento().getId(),
                atividade.getTitulo(),
                atividade.getDescricao(),
                atividade.getPalestrante(),
                atividade.getVagas(),
                atividade.getOcupadas(),
                atividade.getHorario(),
                atividade.getTipo()
        );
    }

    private CursoResponse toCursoResponse(AtividadeEntity curso) {
        int vagas = curso.getVagas() == null ? 0 : curso.getVagas();
        int ocupadas = curso.getOcupadas() == null ? 0 : curso.getOcupadas();
        String status = vagas > 0 && ocupadas >= vagas ? "Lotado" : "Inscricoes abertas";

        return new CursoResponse(
                curso.getId(),
                curso.getTitulo(),
                curso.getDescricao(),
                curso.getPalestrante(),
                vagas,
                ocupadas,
                curso.getHorario(),
                status
        );
    }

    private InscricaoResponse toInscricaoResponse(InscricaoEntity inscricao) {
        AtividadeEntity atividade = inscricao.getAtividade();
        String alunoNome = participanteRepository.findById(inscricao.getAlunoId())
                .map(ParticipanteEntity::getNome)
                .orElse("Aluno " + inscricao.getAlunoId());

        return new InscricaoResponse(
                inscricao.getId(),
                inscricao.getAlunoId(),
                alunoNome,
                atividade.getEvento().getId(),
                atividade.getId(),
                atividade.getId(),
                atividade.getTitulo(),
                inscricao.getStatus(),
                inscricao.getPresenca()
        );
    }

    private PresencaResponse toPresencaResponse(PresencaEntity presenca) {
        InscricaoEntity inscricao = presenca.getInscricao();
        return new PresencaResponse(
                presenca.getId(),
                inscricao.getAtividade().getId(),
                inscricao.getAtividade().getId(),
                inscricao.getId(),
                presenca.getPresente()
        );
    }

    private CertificadoResponse toCertificadoResponse(CertificadoEntity certificado) {
        AtividadeEntity atividade = certificado.getAtividade();
        return new CertificadoResponse(
                certificado.getId(),
                certificado.getAlunoId(),
                atividade.getEvento().getId(),
                atividade.getId(),
                atividade.getId(),
                atividade.getTitulo(),
                atividade.getTitulo(),
                certificado.getCodigo(),
                certificado.getValidado()
        );
    }

    private Long resolverCursoId(Long atividadeId, Long cursoId) {
        Long resolved = cursoId == null ? atividadeId : cursoId;
        if (resolved == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cursoId e obrigatorio");
        }
        return resolved;
    }

    private EventoEntity garantirCatalogoDeCursos() {
        CoordenadorEntity coordenador = garantirCoordenadorPadrao();
        return eventoRepository.findAll().stream()
                .filter(evento -> "Catalogo de Cursos AMRY".equalsIgnoreCase(evento.getTitulo()))
                .findFirst()
                .orElseGet(() -> {
                    EventoEntity catalogo = new EventoEntity(
                            "Catalogo de Cursos AMRY",
                            "Agrupador tecnico dos cursos da plataforma.",
                            LocalDate.now(),
                            LocalDate.now().plusYears(1),
                            "Online",
                            1000,
                            "Inscricoes abertas",
                            List.of("Cursos")
                    );
                    catalogo.definirCoordenadorId(coordenador.getId());
                    return eventoRepository.save(catalogo);
                });
    }

    private CoordenadorEntity garantirCoordenadorPadrao() {
        return coordenadorRepository.findByEmail("coordenador@amry.local")
                .map(coordenador -> {
                    if (coordenador.getSenhaHash() == null || coordenador.getSenhaHash().isBlank()) {
                        coordenador.definirSenhaHash(senhaService.gerarHash("admin123"));
                    }
                    return coordenador;
                })
                .orElseGet(() -> coordenadorRepository.save(new CoordenadorEntity(
                        "Coordenador AMRY",
                        "coordenador@amry.local",
                        "AMRY Cursos",
                        senhaService.gerarHash("admin123")
                )));
    }

    private void garantirParticipante(Long alunoId) {
        if (participanteRepository.existsById(alunoId)) {
            participanteRepository.findById(alunoId).ifPresent(participante -> {
                if (participante.getSenhaHash() == null || participante.getSenhaHash().isBlank()) {
                    participante.definirSenhaHash(senhaService.gerarHash("aluno123"));
                }
            });
            return;
        }
        String cpf = String.format("%011d", alunoId).substring(0, 11);
        participanteRepository.save(new ParticipanteEntity(
                "Aluno " + alunoId,
                "aluno" + alunoId + "@amry.local",
                cpf,
                senhaService.gerarHash("aluno123")
        ));
    }

    private static LocalDate parseDate(String value, LocalDate fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return LocalDate.parse(value);
    }

    private static String orDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
