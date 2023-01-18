import { errorObjectConstructor } from '../helpers/error.helper';
import Teams from '../database/models/teams.model';
import MatchesService from './matches.service';
import Table from '../helpers/tableType';
import tableCalculator from '../helpers/tablePointsCalculator';

class LeaderboardService {
  constructor(
    private _teamsModels = Teams,
    private _matchesService = new MatchesService(),
  ) {}

  public async homeFilter() {
    const finishedMatches = await this._matchesService.getMatchesInProgress('false');

    const tableHome: Table[] = [];

    const promises = finishedMatches.map(async ({ homeTeam, homeTeamGoals, awayTeamGoals }) => {
      const result = await this._teamsModels.findByPk(homeTeam);

      if (!result) throw errorObjectConstructor('Internal error', 'alguma coisa ta errada');

      const team = tableHome.find(({ name }) => name === result.teamName);

      if (!team) {
        tableHome.push(
          tableCalculator.firstGameCalculator(result.teamName, homeTeamGoals, awayTeamGoals),
        );
      } else {
        tableCalculator.updateTableTeamStats(team, homeTeamGoals, awayTeamGoals);
      }
    });

    await Promise.all(promises);

    tableCalculator.sortTable(tableHome);

    return tableHome;
  }

  public async awayFilter() {
    const finishedMatches = await this._matchesService.getMatchesInProgress('false');

    const tableAway: Table[] = [];

    const promises = finishedMatches.map(async ({ awayTeam, homeTeamGoals, awayTeamGoals }) => {
      const result = await this._teamsModels.findByPk(awayTeam);

      if (!result) throw errorObjectConstructor('Internal error', 'alguma coisa ta errada');

      const team = tableAway.find(({ name }) => name === result.teamName);

      if (!team) {
        tableAway.push(
          tableCalculator.firstGameCalculator(result.teamName, awayTeamGoals, homeTeamGoals),
        );
      } else {
        tableCalculator.updateTableTeamStats(team, awayTeamGoals, homeTeamGoals);
      }
    });

    await Promise.all(promises);

    tableCalculator.sortTable(tableAway);

    return tableAway;
  }

  public async leaderboardTable() {
    const table1 = await this.homeFilter();
    const table2 = await this.awayFilter();

    const leaderboard = tableCalculator.sumTableHomeAway(table1, table2);
    tableCalculator.sortTable(leaderboard);

    return leaderboard;
  }
}

export default LeaderboardService;
