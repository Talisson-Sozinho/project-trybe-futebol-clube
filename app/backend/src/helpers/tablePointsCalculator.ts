import Table from './tableType';

const pointsCalculator = (team1Goals:number, team2Goals:number): number => {
  if (team1Goals === team2Goals) return 1;
  if (team1Goals > team2Goals) return 3;
  return 0;
};

const firstGameCalculator = (teamName:string, team1Goals: number, team2Goals: number): Table => ({
  name: teamName,
  totalPoints: pointsCalculator(team1Goals, team2Goals),
  totalGames: 1,
  totalVictories: team1Goals > team2Goals ? 1 : 0,
  totalDraws: team1Goals === team2Goals ? 1 : 0,
  totalLosses: team1Goals < team2Goals ? 1 : 0,
  goalsFavor: team1Goals,
  goalsOwn: team2Goals,
  goalsBalance: team1Goals - team2Goals,
  efficiency: team1Goals > team2Goals ? '100.00' : '0.00',
});

const efficiencyCalculator = (points: number, matches: number): string => (
  ((points / (matches * 3)) * 100).toFixed(2)
);

const updateTableTeamStats = (team: Table, team1Goals: number, team2Goals: number): void => {
  const newTableTeamStats = team;
  newTableTeamStats.totalPoints += pointsCalculator(team1Goals, team2Goals);
  newTableTeamStats.totalGames += 1;
  newTableTeamStats.totalVictories += team1Goals > team2Goals ? 1 : 0;
  newTableTeamStats.totalDraws += team1Goals === team2Goals ? 1 : 0;
  newTableTeamStats.totalLosses += team1Goals < team2Goals ? 1 : 0;
  newTableTeamStats.goalsFavor += team1Goals;
  newTableTeamStats.goalsOwn += team2Goals;
  newTableTeamStats.goalsBalance += team1Goals - team2Goals;
  newTableTeamStats.efficiency = efficiencyCalculator(
    newTableTeamStats.totalPoints,
    newTableTeamStats.totalGames,
  );
};

const sortTable = (table: Table[]): void => {
  table.sort((
    { totalPoints: a, totalVictories: c, goalsBalance: e, goalsFavor: g, goalsOwn: i },
    { totalPoints: b, totalVictories: d, goalsBalance: f, goalsFavor: h, goalsOwn: j },
  ) => {
    if (a === b) {
      if (d === c) {
        if (f === e) {
          if (h === g) {
            return j - i;
          }
          return h - g;
        }
        return f - e;
      }
      return d - c;
    }
    return b - a;
  });
};

const sumTableHomeAway = (table1: Table[], table2: Table[]): Table[] => table1.map((teamTable1) => {
  const teamTable2 = table2.find(({ name }) => name === teamTable1.name);
  if (!teamTable2) return teamTable1;
  return {
    name: teamTable1.name,
    totalPoints: teamTable1.totalPoints + teamTable2.totalPoints,
    totalGames: teamTable1.totalGames + teamTable2.totalGames,
    totalVictories: teamTable1.totalVictories + teamTable2.totalVictories,
    totalDraws: teamTable1.totalDraws + teamTable2.totalDraws,
    totalLosses: teamTable1.totalLosses + teamTable2.totalLosses,
    goalsFavor: teamTable1.goalsFavor + teamTable2.goalsFavor,
    goalsOwn: teamTable1.goalsOwn + teamTable2.goalsOwn,
    goalsBalance: teamTable1.goalsBalance + teamTable2.goalsBalance,
    efficiency: efficiencyCalculator(
      teamTable1.totalPoints + teamTable2.totalPoints,
      teamTable1.totalGames + teamTable2.totalGames,
    ),
  };
});

export default {
  firstGameCalculator,
  updateTableTeamStats,
  sortTable,
  sumTableHomeAway,
};
