import React from "react";

interface FormNavigationProps {
  currentSection: number;
  totalSections: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentSection,
  totalSections,
  onPrev,
  onNext,
  onSubmit,
}) => {
  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === totalSections - 1;

  return (
    <div className="form-navigation">
      {!isFirstSection && (
        <button type="button" onClick={onPrev}>
          Previous
        </button>
      )}

      {!isLastSection ? (
        <button type="button" onClick={onNext}>
          Next
        </button>
      ) : (
        <button type="submit" onClick={onSubmit}>
          Submit Form
        </button>
      )}
    </div>
  );
};

export default FormNavigation;
