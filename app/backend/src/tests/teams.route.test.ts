import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Teams from '../database/models/teams.model';
import { allTeams } from './mock/teams.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Teste da rota /teams', () => {
  it('Verifica se ao acessar a rota, ela responde com a lista de todos os times', async () => {
    sinon
     .stub(Teams, "findAll")
     .resolves(allTeams as Teams[])
    
    const  chaiHttpResponse = await chai.request(app).get('/teams');
  
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allTeams);

    (Teams.findAll as sinon.SinonStub).restore();
  });

  it('Verifica se ao acessar passando um id, retorna o time correto', async () => {
    sinon
    .stub(Teams, "findByPk")
    .resolves(allTeams[2] as Teams)

    const  chaiHttpResponse = await chai.request(app).get('/teams/999999');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allTeams[2]);

    (Teams.findByPk as sinon.SinonStub).restore();
  });

  it('Verifica se ao acessar passando um id invalido, retorna not found', async () => {
    sinon
    .stub(Teams, "findByPk")
    .resolves(null)

    const  chaiHttpResponse = await chai.request(app).get('/teams/999999');

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'id not found' });

    (Teams.findByPk as sinon.SinonStub).restore();
  });

});