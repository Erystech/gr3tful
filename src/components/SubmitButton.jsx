import clsx from "clsx";

const SubmitButton = ({ allFilled, filledCount, isSubmitting, onSubmit }) => {
  const canSubmit = allFilled && !isSubmitting;

  return (
    <div className="opacity-0 animate-fade-slide-up">
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-busy={isSubmitting}
        className={clsx(
          "w-full py-4 px-6 border-none rounded-2xl font-heading text-[17px] italic font-bold transition-all duration-300 flex items-center justify-center gap-2.5",
          canSubmit ? "bg-secondary text-fwhite cursor-pointer" : "bg-borderline text-darkb cursor-not-allowed"
        )}
        onMouseEnter={(e) => { if (canSubmit) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,98,45,0.35)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = canSubmit ? "0 8px 32px rgba(196,98,45,0.25)" : "none"; }}
      >
        {isSubmitting && (
          <span className="w-4.5 h-4.5 rounded-full border-2 border-fwhite/40 border-t-fwhite animate-spin" />
        )}
        {isSubmitting
          ? "Saving…"
          : allFilled
          ? "Save today's gratitudes →"
          : `${3 - filledCount} more to go…`}
      </button>

      {!allFilled && !isSubmitting && filledCount > 0 && (
        <p className="text-center font-parag text-[13px] text-secondary italic mt-3">
          You're doing great — just {3 - filledCount} more ✦
        </p>
      )}
    </div>
  );
}

export default SubmitButton;