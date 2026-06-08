import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final EventoService eventoService;
    private final AtividadeService atividadeService;

    public EventoController(
            EventoService eventoService,
            AtividadeService atividadeService) {

        this.eventoService = eventoService;
        this.atividadeService = atividadeService;
    }

    @GetMapping
    public List<Evento> listarEventos() {

        return eventoService.listarEventos();
    }

    @GetMapping("/{id}")
    public Evento buscarEvento(
            @PathVariable Long id) {

        return eventoService.buscarPorId(id);
    }

    @GetMapping("/{eventoId}/atividades")
    public List<Atividade> listarAtividades(
            @PathVariable Long eventoId) {

        return atividadeService.listarPorEvento(eventoId);
    }
}
