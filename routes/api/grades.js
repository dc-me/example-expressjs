import express, { query } from 'express';
import db from '../../db/conn.js';
import { ObjectId } from 'mongodb';
import error from '../../utils/error.js';
const err404 = error(404, 'Grades does not exist');
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const stats = (
      await db
        .collection('grades')
        .aggregate([
          {
            $group: {
              _id: '$learner_id',
            },
          },
          {
            $count: 'totalLearner',
          },
        ])
        .toArray()
    )[0];

    const result = await db
      .collection('grades')
      .aggregate([
        {
          $unwind: {
            path: '$scores',
          },
        },
        {
          $group: {
            _id: {
              class_id: '$class_id',
              learner_id: '$learner_id',
            },
            quiz: {
              $push: {
                $cond: {
                  if: {
                    $eq: ['$scores.type', 'quiz'],
                  },
                  then: '$scores.score',
                  else: '$$REMOVE',
                },
              },
            },
            exam: {
              $push: {
                $cond: {
                  if: {
                    $eq: ['$scores.type', 'exam'],
                  },
                  then: '$scores.score',
                  else: '$$REMOVE',
                },
              },
            },
            homework: {
              $push: {
                $cond: {
                  if: {
                    $eq: ['$scores.type', 'homework'],
                  },
                  then: '$scores.score',
                  else: '$$REMOVE',
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            class_id: '$_id.class_id',
            learner_id: '$_id.learner_id',
            avg: {
              $sum: [
                {
                  $multiply: [
                    {
                      $avg: '$exam',
                    },
                    0.5,
                  ],
                },
                {
                  $multiply: [
                    {
                      $avg: '$quiz',
                    },
                    0.3,
                  ],
                },
                {
                  $multiply: [
                    {
                      $avg: '$homework',
                    },
                    0.2,
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: '$learner_id',
            classes: {
              $push: '$class_id',
            },
            avg: {
              $avg: '$avg',
            },
          },
        },
        {
          $match: {
            avg: {
              $gt: 65,
            },
          },
        },
      ])
      .toArray();

    stats.learnerAvg65Count = result.length;
    stats.percentage =
      Math.round((stats.learnerAvg65Count / stats.totalLearner) * 1000) / 1000;

    res.json(stats);
    res.json(result);
  } catch (err) {}
});

router.route('/:id').get(async (req, res) => {
  const query = {
    _id: new ObjectId(req.params.id),
  };

  const grade = await db.collection('grades').findOne(query);
  res.json(grade);
});

router.get('/leaner/:id/avg', async (req, res, next) => {
  const query = {
    learner_id: Number(req.params.id),
  };
  try {
    const grades = await db.collection('grades').find(query).toArray();
    if (grades.length > 0) {
      const avgs = grades.reduce((acc, g) => {
        let sum = 0;
        for (const s of g.scores) {
          if (typeof s.score === 'number') sum += s.score;
        }
        acc[g.class_id] = {
          avg: sum / g.scores.length,
        };
        return acc;
      }, {});

      res.json(avgs);
    } else {
      next(err404);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
