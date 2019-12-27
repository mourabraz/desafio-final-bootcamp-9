import React, { useState, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import { Container, List, EmptyList } from './styles';

export default function BirthdaysList() {
  const [birthdays, setBirthdays] = useState([]);

  useEffect(() => {
    async function loadBirthdays() {
      try {
        const { data } = await api.get(`/dashboard/birthdays`);
        const list = data.map(item => ({
          ...item,
          formattedDay: format(parseISO(item.birthday), "dd 'de' MMMM", {
            locale: pt,
          }),
          birthday: item.birthday.split('T')[0],
        }));
        setBirthdays(list.sort((a, b) => (a.days > b.days ? 1 : -1)));
      } catch (error) {
        console.tron.error(error);
      }
    }

    loadBirthdays();
  }, []);

  return (
    <Container>
      <header>
        <h2>
          Aniversários <span>dos próximos 30 dias</span>
        </h2>
      </header>

      {birthdays.length ? (
        <List>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Nascimento</th>
              <th>Faltam em dias</th>
              <th>Dia</th>
            </tr>
          </thead>
          <tbody>
            {birthdays.map(item => (
              <tr key={String(item.id)}>
                <td>{item.name}</td>
                <td className="text-center">{item.age}</td>
                <td className="text-center">{item.birthday}</td>
                <td className="text-center">{item.days}</td>
                <td className="text-right">{item.formattedDay}</td>
              </tr>
            ))}
          </tbody>
        </List>
      ) : (
        <EmptyList>
          <p>Sem aniversários nos próximos 30 dias</p>
        </EmptyList>
      )}
    </Container>
  );
}
