const FloatingButton = ({ text, color, onClick }) => {
    const splitText = text.split(" ");
<<<<<<< HEAD
  
    return (
      <button
        onClick={onClick}
        className={`flex fixed bottom-4 right-4 items-center justify-center w-14 h-14 rounded-full shadow-lg 
=======

    return (
        <button
            onClick={onClick}
            className={`flex fixed bottom-4 right-4 items-center justify-center w-14 h-14 rounded-full shadow-lg 
>>>>>>> frontend
        bg-gradient-to-b ${color} text-white text-xs font-bold
        transition-all duration-200 ease-in-out
        hover:scale-110 hover:shadow-xl
        active:scale-105 active:brightness-90`}
<<<<<<< HEAD
      >
        {splitText.map((line, index) => (
          <span key={index}>{line}</span>
        ))}
      </button>
    );
  };
  
  export default FloatingButton;
=======
        >
            {splitText.map((line, index) => (
                <span key={index}>{line}</span>
            ))}
        </button>
    );
};

export default FloatingButton;
>>>>>>> frontend
