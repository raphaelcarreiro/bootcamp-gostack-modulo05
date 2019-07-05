import React, { useState, useEffect } from 'react';
import { Form, SubmitButton, List, TextError } from './styles';
import Container from '../container';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../src/services/api';

export default function Main() {
  const [newRepo, setNewRepo] = useState('rocketseat/unform');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [textError, setTextError] = useState(null);

  useEffect(() => {
    const repos = localStorage.getItem('repositories');
    if (repos) setRepositories(JSON.parse(repos));
  }, []);

  useEffect(() => {
    if (repositories.length > 0)
      localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setInputError(false);
    setTextError('');
    api
      .get('/repos/' + newRepo)
      .then(response => {
        const copyRepo = repositories.slice();
        copyRepo.push({ name: response.data.full_name });
        setRepositories(copyRepo);
        setNewRepo('');
      })
      .catch(err => {
        if (err.response.status === 404) {
          setInputError(true);
          setTextError('Repositório não encontrado');
        }
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

      <Form error={inputError} onSubmit={handleSubmit}>
        <div className="input">
          <input
            value={newRepo}
            onChange={event => setNewRepo(event.target.value)}
            type="text"
            placeholder="Adicionar repositório"
          />
          <TextError>{inputError ? textError : null}</TextError>
        </div>

        <SubmitButton isLoading={loading}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>
      <List>
        {repositories.map(repo => (
          <li key={repo.name}>
            <span>{repo.name}</span>
            <Link to={'/repository/' + encodeURIComponent(repo.name)}>
              Detalhes
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
