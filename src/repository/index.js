import React, { useEffect, useState, Fragment } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import Container from '../container';
import { Loading, Owner, IssueList, Paginator } from './styles';
import { Link } from 'react-router-dom';

export default function Repository(props) {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { params } = props.match;
  const [errorLoadRepo, setErroLoadRepo] = useState(false);
  const [page, setPage] = useState(1);

  const repoName = decodeURIComponent(params.repository);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        params: {
          page: page,
          state: 'open',
          per_page: 5,
        },
      }),
    ])
      .then(response => {
        const [r, i] = response;
        setRepository(r.data);
        setIssues(i.data);
      })
      .catch(err => {
        if (err.response && err.response.status === 403) {
          setErroLoadRepo(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [repoName, page]);

  function handleNextPage() {
    setPage(page + 1);
  }

  function handlePriorPage() {
    setPage(page - 1);
  }

  return (
    <Fragment>
      {!loading && !errorLoadRepo ? (
        <Container>
          <Owner>
            <Link to="/">Voltar aos repositórios</Link>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <h1>{repository.name}</h1>
            <p>{repository.description}</p>
          </Owner>
          <IssueList>
            {issues.map(issue => {
              return (
                <li key={String(issue.id)}>
                  <img src={issue.user.avatar_url} alt={issue.user.login} />
                  <div>
                    <strong>
                      <a href={issue.html_url}>{issue.title}</a>
                      {issue.labels.map(label => (
                        <span key={String(label.id)}>{label.name}</span>
                      ))}
                    </strong>
                    <p>{issue.user.login}</p>
                  </div>
                </li>
              );
            })}
          </IssueList>
          <Paginator>
            <button disabled={page === 1} onClick={handlePriorPage}>
              Anterior
            </button>
            <button onClick={handleNextPage}>Próximo</button>
          </Paginator>
        </Container>
      ) : (
        <Loading>
          <FaSpinner color="#fff" size={32} />
        </Loading>
      )}
    </Fragment>
  );
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
