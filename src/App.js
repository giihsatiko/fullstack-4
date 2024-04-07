import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

export default function App() {
  const [quartos, setQuartos] = useState([]);
  const [quartoSelecionado, setQuartoSelecionado] = useState(-1);

  function buscarQuartos() {
    fetch("http://localhost:4000/acomodacao")
      .then(res => res.json())
      .then(res => {
        setQuartos(res.listaAcomodacaos);
      })
      .catch(erro => {
        console.log('erro', erro)
      })
  }

  useEffect(() => {
    buscarQuartos();
  }, [])

  function onQuartoClick(e) {
    const id = e.target.value - 1;
    if (quartos) {
      setQuartoSelecionado(quartos[id]);
    }
  }

  const [dados, setDados] = useState([{}])
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [mask, setMask] = useState("");

  function checkin(hospede_codigo,
    acomodacao_codigo, data_checkin, hosp_qtd) {

    console.log(hospede_codigo,
      acomodacao_codigo, data_checkin, hosp_qtd)
    const novoId = parseInt(hospede_codigo)
    const obj = {
      hospede_codigo: novoId,
      acomodacao_codigo,
      data_checkin,
      hosp_qtd
    }

    console.log('obj', obj)

    fetch("http://localhost:4000/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setQuartos(res.listaAcomodacaos);
      })
      .catch(erro => {
        console.log('erro', erro)
      })
  }
  const handleChange = (event, index) => {
    const novoValor = event.target.value;
    const novosDados = [...dados];
    novosDados[index] = novoValor;
    setDados(novosDados);
  };

  console.log('dados', dados)
  return (
    <Container fluid className='w-100 h-100 d-flex justify-content-center mt-5'>
      <Form className='w-50 bg-dark text-white p-3 d-flex justify-content-center flex-column rounded'>
        <Form.Group className="mb-3" controlId="nome">
          <Form.Label>Informe o código do hóspede</Form.Label>
          <Form.Control type="text" placeholder="Insira o código do hóspede" onChange={(e) => handleChange(e, 0)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="documento">
          <Form.Label>Documento</Form.Label>
          <Form.Control type="text" placeholder="Insira o documento" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="telefone">
          <Form.Label>Telefone</Form.Label>
          <Form.Control type="text" placeholder="Insira o telefone" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="acomodacao_codigo">
          <Form.Label>Quarto</Form.Label>
          <Form.Select onClick={onQuartoClick}>
            <option value="-1">Selecione um quarto</option>
            {quartos && quartos.map((quarto) => (
              <option value={quarto.codigo} key={quarto.codigo}>{quarto.tipo}</option>
            ))}
          </Form.Select>
          <Row>
            <Col xs={4}>
              <Form.Control type="text" placeholder="Capacidade" className='mt-3 text-center' disabled value={quartoSelecionado.capacidade} />
            </Col>
            <Col xs={8}>
              <Form.Control as="textarea" multiple placeholder="Descricao" className='mt-3' disabled value={quartoSelecionado.descricao} />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3" controlId="data_checkin">
          <Form.Label>Data da entrada</Form.Label>
          <Form.Control type="date" onChange={(e) => handleChange(e, 1)} />
        </Form.Group>
        <Button variant="primary" className='mt-5 d-flex justify-content-center align-items-center' onClick={(e) => { e.preventDefault(); checkin(dados[0], quartoSelecionado.codigo, dados[1], quartoSelecionado.capacidade) }} >
          Enviar
          <div className='mx-1'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg></div>
        </Button>
      </Form>
    </Container>
  );
}
