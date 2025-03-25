import React, { useState } from 'react';

/**
 * @description 기사의 퀴즈를 보여주는 컴포넌트
 * 
 * @todo [퀴즈 문제] 구현 필요
 * @todo [퀴즈 문제] 구현 방법: [3개의 퀴즈 문제 순차적 노출]
 * @todo [퀴즈 문제] 요구사항: [문제당 선지 제공 및 사용자 선택 기능]
 * 
 * @todo [정답 처리] 구현 필요
 * @todo [정답 처리] 구현 방법: [오답 선택시 정답 표시]
 * @todo [정답 처리] 요구사항: [전체 사용자의 선지별 선택 비율 표시]
 * 
 * @todo [퀴즈 해설] 구현 필요
 * @todo [퀴즈 해설] 구현 방법: [모든 문제 완료 후 해설 제공]
 * @todo [퀴즈 해설] 요구사항: [문제별 상세 해설 하단 표시]
 * 
 * @todo [네비게이션] 구현 필요
 * @todo [네비게이션] 구현 방법: [퀴즈 완료 후 이동 버튼 표시]
 * @todo [네비게이션] 요구사항: [기사로 돌아가기, 홈으로 가기 버튼 제공]
 */

// Props 추가
const Quiz = ({ onClose }) => {
  // Sample quiz data based on the provided structure
  const quizData = {
    quizzes: [
      {
        quiz_id: 1,
        question: "AI 기술 발전이 가져올 가장 큰 변화는?",
        options: [
          { option_id: 1, text: "자동화 시스템 확대", is_correct: false, choice_rate: 0.25 },
          { option_id: 2, text: "개인화된 서비스 제공", is_correct: true, choice_rate: 0.45 },
          { option_id: 3, text: "데이터 처리 속도 향상", is_correct: false, choice_rate: 0.20 },
          { option_id: 4, text: "보안 시스템 강화", is_correct: false, choice_rate: 0.10 }
        ],
        explanation: "AI 기술은 개인화된 맞춤형 서비스를 제공하여 사용자 경험을 크게 향상시킵니다."
      },
      {
        quiz_id: 2,
        question: "블록체인 기술의 주요 특징은?",
        options: [
          { option_id: 1, text: "중앙화된 데이터 관리", is_correct: false, choice_rate: 0.15 },
          { option_id: 2, text: "빠른 처리 속도", is_correct: false, choice_rate: 0.20 },
          { option_id: 3, text: "분산원장 기술", is_correct: true, choice_rate: 0.55 },
          { option_id: 4, text: "간편한 구현", is_correct: false, choice_rate: 0.10 }
        ],
        explanation: "블록체인의 핵심 특징은 분산원장 기술을 통한 데이터의 투명성과 신뢰성 보장입니다."
      },
      {
        quiz_id: 3,
        question: "메타버스 산업의 미래 전망은?",
        options: [
          { option_id: 1, text: "교육 분야 혁신", is_correct: true, choice_rate: 0.40 },
          { option_id: 2, text: "게임 산업 한정", is_correct: false, choice_rate: 0.25 },
          { option_id: 3, text: "일시적 트렌드", is_correct: false, choice_rate: 0.20 },
          { option_id: 4, text: "제한적 성장", is_correct: false, choice_rate: 0.15 }
        ],
        explanation: "메타버스는 교육 분야에서 혁신적인 학습 경험을 제공할 것으로 전망됩니다."
      }
    ]
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(new Array(3).fill(null));
  const [showWarning, setShowWarning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);

  const progress = ((currentQuestion + 1) / quizData.quizzes.length) * 100;

  // handleAnswerSelect 수정
  const handleAnswerSelect = (optionId) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionId;
    setSelectedAnswers(newAnswers);
    setShowWarning(false); // 선택하면 경고 메시지 숨기기
  };

  // handleNext 수정
  const handleNext = () => {
    if (selectedAnswers[currentQuestion] === null) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    setShowResult(true);
  };


  const handlePrevResult = () => {
    setShowResult(true);
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleContinue = () => {
    setShowResult(false);
    if (currentQuestion < quizData.quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowFinalResults(true);
    }
  };

  const getCurrentQuiz = () => quizData.quizzes[currentQuestion];

  const calculateScore = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => {
      const quiz = quizData.quizzes[index];
      const selectedOption = quiz.options.find(opt => opt.option_id === answer);
      return selectedOption?.is_correct;
    }).length;
    return (correctAnswers / quizData.quizzes.length) * 100;
  };

  if (showFinalResults) {
    return (
      <div className="max-w-3xl mx-auto md:px-20 py-8 h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain isolate [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        {/* <h2 className="text-2xl font-bold mb-8">퀴즈 결과</h2> */}
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
                  {/* Background bar for choice rate */}
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${option.is_correct
                      ? 'bg-green-100'
                      : selectedAnswers[index] === option.option_id
                        ? 'bg-red-100'
                        : 'bg-gray-100'
                      }`}
                    style={{ width: `${option.choice_rate * 100}%` }}
                  />
                  {/* Content */}
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
                {quiz.explanation}
              </p>
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-16 mb-8">
          <button
            onClick={() => {
              onClose();
            }}
            className="px-8 md:px-16 py-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto"
          >
            기사 보기
          </button>
          <button
            onClick={() => window.location.href = '/home'}
            className="px-8 md:px-16 py-4 bg-[#1E4C9A] text-white rounded-lg hover:bg-[#183c7a] transition-colors w-full md:w-auto"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const quiz = getCurrentQuiz();
    const selectedOption = quiz.options.find(opt => opt.option_id === selectedAnswers[currentQuestion]);
    return (
      <div className="max-w-3xl mx-auto md:px-20 py-8 h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain isolate [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
        {/* Question Counter */}
        <div className="text-right mb-4">
          Question {currentQuestion + 1} / {quizData.quizzes.length}
        </div>

        {/* Progress Bar */}
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
              className="px-10 py-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
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
