import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AtividadeService {

    private final AtividadeRepository atividadeRepository;

    public AtividadeService(
            AtividadeRepository atividadeRepository) {

        this.atividadeRepository = atividadeRepository;
    }

    public List<Atividade> listarPorEvento(Long eventoId) {

        return atividadeRepository.findByEventoId(eventoId);
    }
}
