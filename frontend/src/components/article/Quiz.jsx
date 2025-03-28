import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitQuizAnswers } from '../../store/slices/quizSlice';

const Quiz = ({ articleId, quizzes, onClose }) => {
  // 퀴즈가 없을 경우 처리
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto md:px-20 py-8 flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-2xl text-gray-600 mb-8">이 기사에 대한 퀴즈가 없습니다.</p>
        <button
          onClick={onClose}
          className="px-8 md:px-16 py-4 bg-[#1E4C9A] text-white rounded-lg hover:bg-[#183c7a] transition-colors"
        >
          기사로 돌아가기
        </button>
      </div>
    );
  }

  // 퀴즈 데이터 가공
  const quizData = {
    quizzes: quizzes.map(quiz => ({
      ...quiz,
      options: quiz.options.map(option => ({
        ...option,
        choice_rate: option.option_selection_rate
      }))
    }))
  };

  // 상태 관리 훅들
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(quizzes?.length || 0).fill(null));
  const [showWarning, setShowWarning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const quizAttemptStatus = useSelector((state) => state.quiz.quizAttemptStatus);
  const selectedOptions = useSelector((state) => state.quiz.selectOptions);

  // 이미 퀴즈를 푼 경우 초기 상태 설정
  useEffect(() => {
    if (quizAttemptStatus && selectedOptions && quizData.quizzes.length > 0) {
      // 참조 동등성 문제 방지를 위해 map 함수 내부에서 직접 찾기
      const initialAnswers = quizData.quizzes.map(quiz => {
        const attemptedQuiz = selectedOptions.find(opt => opt.quizId === quiz.quiz_id);
        return attemptedQuiz ? attemptedQuiz.optionId : null;
      });

      // 상태 업데이트 전에 변경 확인
      setSelectedAnswers(prevAnswers => {
        const isChanged = initialAnswers.some((answer, index) => answer !== prevAnswers[index]);
        return isChanged ? initialAnswers : prevAnswers;
      });

      setShowFinalResults(true);
    }
  }, [quizAttemptStatus, selectedOptions, quizData.quizzes]);

  // 진행 상태 계산
  const progress = ((currentQuestion + 1) / quizData.quizzes.length) * 100;

  const dispatch = useDispatch();

  // 최종 결과 제출 함수 (API 호출)
  const submitQuizResults = async () => {
    try {
      const finalDetailedAnswers = quizData.quizzes.map((quiz, index) => ({
        quizId: quiz.quiz_id,
        selectedOptionId: selectedAnswers[index]
      }));

      console.log(finalDetailedAnswers);

      // API 호출 (주석 해제 필요)
      const response = await dispatch(submitQuizAnswers({
        articleId: articleId,
        answers: finalDetailedAnswers
      })).unwrap();

      console.log('퀴즈 답변 제출 성공', response);
    } catch (error) {
      console.error('퀴즈 답변 제출 실패', error);
      setSubmitError('퀴즈 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 답변 선택 핸들러
  const handleAnswerSelect = (optionId) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionId;
    setSelectedAnswers(newAnswers);
    setShowWarning(false);
  };

  // 다음 단계로 진행 핸들러
  const handleNext = () => {
    if (selectedAnswers[currentQuestion] === null) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    setShowResult(true);
  };

  // 이전 결과 보기 핸들러
  const handlePrevResult = () => {
    setShowResult(true);
    setCurrentQuestion(currentQuestion - 1);
  };

  // 계속 진행 핸들러
  const handleContinue = () => {
    setShowResult(false);
    if (currentQuestion < quizData.quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowFinalResults(true);
    }
  };

  // 현재 퀴즈 가져오기
  const getCurrentQuiz = () => quizData.quizzes[currentQuestion];

  // 최종 결과 화면
  if (showFinalResults) {
    return (
      <div className="max-w-3xl mx-auto md:px-20 py-8 h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain isolate [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        {quizData.quizzes.map((quiz, index) => (
          <div key={quiz.quiz_id} className="mb-12">
            <h3 className="text-xl font-semibold mb-6">
              {index + 1}. {quiz.question}
            </h3>

            <div className="flex flex-col gap-4 mb-6">
              {quiz.options.map((option) => (
                <div
                  key={option.option_id}
                  className={`relative w-full p-5 text-left border rounded-lg overflow-hidden ${selectedAnswers[index] === option.option_id
                    ? option.is_correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : option.is_correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                    }`}
                >
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${option.is_correct
                      ? 'bg-green-100'
                      : selectedAnswers[index] === option.option_id
                        ? 'bg-red-100'
                        : 'bg-gray-100'
                      }`}
                    style={{ width: `${option.choice_rate * 100}%` }}
                  />
                  <div className="relative flex justify-between items-center z-10">
                    <div>
                      {String.fromCharCode(64 + option.option_id)}. {option.text}
                    </div>
                    <div className="text-gray-500 font-medium">
                      {(option.choice_rate * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                {quiz.reason}
              </p>
            </div>
          </div>
        ))}

        {/* 제출 오류 메시지 */}
        {submitError && (
          <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {submitError}
          </div>
        )}

        {/* 제출 로딩 상태 */}
        {isSubmitting && (
          <div className="text-center text-gray-600 mb-4">
            퀴즈 결과를 제출하는 중입니다...
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between gap-4 mt-16 mb-8">
          <button
            onClick={() => {
              if (!quizAttemptStatus) {
                submitQuizResults();
              }
              onClose();
            }}
            className="px-8 md:px-16 py-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto"
          >
            기사 보기
          </button>
          <button
            onClick={() => {
              if (!quizAttemptStatus) {
                submitQuizResults();
              }
              window.location.href = '/home';
            }}
            className="px-8 md:px-16 py-4 bg-[#1E4C9A] text-white rounded-lg hover:bg-[#183c7a] transition-colors w-full md:w-auto"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (showResult) {
    const quiz = getCurrentQuiz();
    const selectedOption = quiz.options.find(opt => opt.option_id === selectedAnswers[currentQuestion]);
    return (
      <div className="max-w-3xl mx-auto md:px-20 py-8 h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain isolate [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        <div className="text-right mb-4">
          Question {currentQuestion + 1} / {quizData.quizzes.length}
        </div>

        <div className="relative">
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-[#74BDE0] to-[#1E4C9A] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 pt-3"
            style={{
              left: `${progress}%`,
              transform: `translateX(-50%) translateY(-50%)`
            }}
          >
            <img
              src="/quiz_fire.png"
              alt="progress indicator"
              className="w-6 h-6 -mt-4"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-10 mt-10">
          {getCurrentQuiz().question}
        </h2>

        <div className="flex flex-col gap-4">
          {getCurrentQuiz().options.map((option) => (
            <div
              key={option.option_id}
              className={`w-full p-5 text-left border rounded-lg ${selectedAnswers[currentQuestion] === option.option_id
                ? option.is_correct
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : option.is_correct
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
                }`}
            >
              {String.fromCharCode(64 + option.option_id)}. {option.text}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-10">
          {currentQuestion > 0 && (
            <button
              onClick={handlePrevResult}
              className="px-10 py-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            >
              이전
            </button>
          )}
          <button
            onClick={handleContinue}
            className="px-10 py-4 bg-[#1E4C9A] text-white rounded-lg hover:bg-[#183c7a] transition-colors"
          >
            {currentQuestion === quizData.quizzes.length - 1 ? '결과 보기' : '다음'}
          </button>
        </div>
      </div>
    );
  }

  // 기본 퀴즈 화면
  return (
    <div className="max-w-3xl mx-auto md:px-20 py-8 h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain isolate [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
      <div className="text-right mb-4">
        Question {currentQuestion + 1} / {quizData.quizzes.length}
      </div>

      <div className="relative">
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-[#74BDE0] to-[#1E4C9A] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div
          className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 pt-3"
          style={{
            left: `${progress}%`,
            transform: `translateX(-50%) translateY(-50%)`
          }}
        >
          <img
            src="/quiz_fire.png"
            alt="progress indicator"
            className="w-6 h-6 -mt-4"
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-10 mt-10">
        {getCurrentQuiz().question}
      </h2>

      <div className="flex flex-col gap-4">
        {getCurrentQuiz().options.map((option) => (
          <button
            key={option.option_id}
            onClick={() => handleAnswerSelect(option.option_id)}
            className={`w-full p-5 text-left border rounded-lg transition-colors ${selectedAnswers[currentQuestion] === option.option_id
              ? 'bg-[#1E4C9A] text-white'
              : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
          >
            {String.fromCharCode(64 + option.option_id)}. {option.text}
          </button>
        ))}
        {showWarning && (
          <div className="mt-2 p-2 text-gray-600 bg-gray-100 rounded-lg border border-gray-400 text-center">
            정답을 선택해주세요
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-10">
        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            className="px-10 py-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            이전
          </button>)}
        <button
          onClick={handleNext}
          className="px-10 py-4 bg-[#1E4C9A] text-white rounded-lg hover:bg-[#183c7a] transition-colors"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default Quiz;