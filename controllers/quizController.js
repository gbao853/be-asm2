const Quiz = require('../models/quiz');
const Question = require('../models/question');

exports.getQuizzes = async (req, res) => {
    const quizzes = await Quiz.find().populate('questions');
    res.json(quizzes);
};

exports.getQuizById = async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId).populate('questions');
    res.json(quiz);
};

exports.createQuiz = async (req, res) => {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json(quiz);
};
exports.updateQuiz = async (req, res) => {
  try {
      const quiz = await Quiz.findByIdAndUpdate(
          req.params.quizId,
          req.body,
          { new: true, runValidators: true }
      );

      if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
      }

      res.json(quiz);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
exports.deleteQuiz = async (req, res) => {
    await Quiz.findByIdAndDelete(req.params.quizId);
    res.json({ message: 'Quiz deleted' });
};

exports.addQuestionToQuiz = async (req, res) => {
  try {
      const quiz = await Quiz.findById(req.params.quizId);
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
      }

      if (!quiz.questions) {
          quiz.questions = [];
      }

      const question = new Question(req.body);
      await question.save();

      quiz.questions.push(question._id);
      await quiz.save();

      res.json(quiz);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};