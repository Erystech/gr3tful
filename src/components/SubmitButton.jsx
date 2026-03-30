import clsx from "clsx";

const  SubmitButton = ({ allFilled, filledCount, onSubmit }) => {
  return (
    <div className="opacity-0 animate-fade-slide-up">
      <button
        onClick={onSubmit}
        disabled={!allFilled}
        className={clsx(
          "w-full py-4 px-6 border-none rounded-2xl font-heading text-[17px] italic font-bold transition-all duration-300",
          allFilled ? "bg-secondary text-fwhite cursor-pointer" : "bg-borderline text-darkb cursor-not-allowed"
        )}
        onMouseEnter={(e) => { if (allFilled) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,98,45,0.35)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = allFilled ? "0 8px 32px rgba(196,98,45,0.25)" : "none"; }}
      >
        {allFilled ? "Save today's gratitudes →" : `${3 - filledCount} more to go…`}
      </button>
      {!allFilled && filledCount > 0 && (
        <p className="text-center font-parag text-[13px] text-secondary italic mt-3">
          You're doing great — just {3 - filledCount} more ✦
        </p>
      )}
    </div>
  );
}

export default SubmitButton;