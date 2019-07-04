import React, { useState } from 'react';
import { Container, Form, SubmitButton } from './styles';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../src/services/api';

export default function Main() {
  const [newRepo, setNewRepo] = useState('rocketseat/unform');
  const [repositories, setRepositories] = useState({});
  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    api
      .get('/repos/' + newRepo)
      .then(response => {
        setRepositories({
          name: response.data.full_name,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Container>
      <h1>
        <FaGithubAlt /> Repositórios
      </h1>

      <Form onSubmit={handleSubmit}>
        <input
          value={newRepo}
          onChange={event => setNewRepo(event.target.value)}
          type="text"
          placeholder="Adicionar repositório"
        />

        <SubmitButton loading={loading}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>
    </Container>
  );
}
