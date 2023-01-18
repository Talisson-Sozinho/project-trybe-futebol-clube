import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import Matches from '../database/models/matches.model';
import { allMatchesWithName } from './mock/matches.mock';
import leaderboardTable, { awayLeaderboard, homeLeaderboard } from './mock/leaderboard.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Teste da rota /leaderboard', () => {

  beforeEach(() => {
    sinon.stub(Matches, "findAll").resolves(allMatchesWithName.filter(
      ({inProgress}) => inProgress === false
    ) as Matches[]);
  });

  afterEach(() => {
    (Matches.findAll as sinon.SinonStub).restore();
  });

  it('verificando se retorna a tabela certa ao acessar /leaderboard', async () => {

    const chaiHttpResponse = await chai.request(app).get('/leaderboard');
  
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(leaderboardTable);
  });

  it('verificando se retorna a tabela filtrada corretamente ao acessar /leaderboard/home', async () => {

    const chaiHttpResponse = await chai.request(app).get('/leaderboard/home');
  
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(homeLeaderboard);
  });

  it('verificando se retorna a tabela filtrada corretamente ao acessar /leaderboard/away', async () => {

    const chaiHttpResponse = await chai.request(app).get('/leaderboard/away');
  
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(awayLeaderboard);
  });
});
