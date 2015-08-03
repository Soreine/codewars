var optimumLocation = function(students, locations){
  var best = locations.map(
    function (school) {
      school.score = students.reduce(
        function (score, student) {
          return score
            + Math.abs(school.x - student[0])
            + Math.abs(school.y - student[1]);
        }, 0);
      return school;
    }
  ).reduce(
    function(acc, v) { return v.score < acc.score ? v : acc; }
  );
  return "The best location is number " + best.id
    + " with the coordinates x = " + best.x + " and y = " + best.y;
};
