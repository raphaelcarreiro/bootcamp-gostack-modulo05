import React, { useEffect, useState, Fragment } from 'react';
import api from '../services/api';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import Container from '../container';
import { Loading, Owner } from './styles';

export default function Repository(props) {
  const [repository, setRepository] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { params } = props.match;

  const repoName = decodeURIComponent(params.repository);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        params: {
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
      .finally(() => {
        setLoading(false);
      });
  }, [repoName]);

  return (
    <Fragment>
      {!loading ? (
        <Container>
          <Owner>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <h1>{repository.name}</h1>
            <p>{repository.description}</p>
          </Owner>
          <h1>Issues</h1>
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
