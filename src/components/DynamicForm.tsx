import React, { useState, useEffect } from "react";
import { getForm } from "../api/mockAPI";
import {
  FormResponse,
  FormSection,
  FormField,
  FormValues,
  ValidationErrors,
  ValidationResult,
} from "../types";

const DynamicForm: React.FC = () => {
  const [formData, setFormData] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  const [formValues, setFormValues] = useState<FormValues>({});

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const data = await getForm();
        setFormData(data);
        const initialValues: FormValues = {};
        data.form.sections.forEach((section) => {
          section.fields.forEach((field) => {
            if (field.type === "checkbox") {
              initialValues[field.fieldId] = [];
            } else {
              initialValues[field.fieldId] = "";
            }
          });
        });
        setFormValues(initialValues);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch form data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  const currentSection = formData?.form.sections[currentSectionIndex];

  const handleInputChange = (fieldId: string, value: string | string[]) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
    if (validationErrors[fieldId]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (
    fieldId: string,
    value: string,
    checked: boolean
  ) => {
    setFormValues((prevValues) => {
      const currentValues = (prevValues[fieldId] as string[]) || [];
      let newValues: string[];

      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter((v) => v !== value);
      }

      return {
        ...prevValues,
        [fieldId]: newValues,
      };
    });

    if (validationErrors[fieldId]) {
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateSection = (section: FormSection): ValidationResult => {
    const errors: ValidationErrors = {};
    let isValid = true;

    section.fields.forEach((field) => {
      const value = formValues[field.fieldId];

      if (field.required) {
        if (field.type === "checkbox") {
          const checkboxValues = value as string[];
          if (!checkboxValues || checkboxValues.length === 0) {
            errors[field.fieldId] =
              field.validation?.message || "This field is required";
            isValid = false;
          }
        } else if (
          !value ||
          (typeof value === "string" && value.trim() === "")
        ) {
          errors[field.fieldId] =
            field.validation?.message || "This field is required";
          isValid = false;
        }
      }

      if (
        field.minLength &&
        typeof value === "string" &&
        value.length < field.minLength
      ) {
        errors[
          field.fieldId
        ] = `Minimum length is ${field.minLength} characters`;
        isValid = false;
      }

      if (
        field.maxLength &&
        typeof value === "string" &&
        value.length > field.maxLength
      ) {
        errors[
          field.fieldId
        ] = `Maximum length is ${field.maxLength} characters`;
        isValid = false;
      }

      if (field.type === "email" && typeof value === "string" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.fieldId] = "Please enter a valid email address";
          isValid = false;
        }
      }

      if (field.type === "tel" && typeof value === "string" && value) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          errors[field.fieldId] = "Please enter a valid 10-digit phone number";
          isValid = false;
        }
      }
    });

    return { isValid, errors };
  };

  const handleNext = () => {
    if (!currentSection) return;
    const { isValid, errors } = validateSection(currentSection);

    if (isValid) {
      setCurrentSectionIndex((prev) => prev + 1);

      setValidationErrors({});

      setValidationErrors(errors);
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex((prev) => Math.max(0, prev - 1));

    setValidationErrors({});
  };

  const handleSubmit = () => {
    if (!currentSection || !formData) return;

    const { isValid, errors } = validateSection(currentSection);

    if (isValid) {
      console.log("Form submitted with values:", formValues);

      alert("Form submitted successfully! Check the console for form values.");
    } else {
      setValidationErrors(errors);
    }
  };

  const renderField = (field: FormField) => {
    const { fieldId, type, label, placeholder, required, dataTestId, options } =
      field;
    const value = formValues[fieldId] || "";
    const error = validationErrors[fieldId];

    switch (type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div className="form-field" key={fieldId}>
            <label htmlFor={fieldId}>
              {label}
              {required && <span className="required">*</span>}
            </label>
            <input
              type={type}
              id={fieldId}
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              data-testid={dataTestId}
              required={required}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "textarea":
        return (
          <div className="form-field" key={fieldId}>
            <label htmlFor={fieldId}>
              {label}
              {required && <span className="required">*</span>}
            </label>
            <textarea
              id={fieldId}
              placeholder={placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              data-testid={dataTestId}
              required={required}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "date":
        return (
          <div className="form-field" key={fieldId}>
            <label htmlFor={fieldId}>
              {label}
              {required && <span className="required">*</span>}
            </label>
            <input
              type="date"
              id={fieldId}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              data-testid={dataTestId}
              required={required}
            />
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "dropdown":
        return (
          <div className="form-field" key={fieldId}>
            <label htmlFor={fieldId}>
              {label}
              {required && <span className="required">*</span>}
            </label>
            <select
              id={fieldId}
              value={value as string}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
              data-testid={dataTestId}
              required={required}
            >
              <option value="">Select an option</option>
              {options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  data-testid={option.dataTestId}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "radio":
        return (
          <div className="form-field radio-group" key={fieldId}>
            <fieldset>
              <legend>
                {label}
                {required && <span className="required">*</span>}
              </legend>
              {options?.map((option) => (
                <div className="radio-option" key={option.value}>
                  <input
                    type="radio"
                    id={`${fieldId}-${option.value}`}
                    name={fieldId}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleInputChange(fieldId, e.target.value)}
                    data-testid={option.dataTestId}
                    required={required}
                  />
                  <label htmlFor={`${fieldId}-${option.value}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </fieldset>
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      case "checkbox":
        return (
          <div className="form-field checkbox-group" key={fieldId}>
            <fieldset>
              <legend>
                {label}
                {required && <span className="required">*</span>}
              </legend>
              {options?.map((option) => (
                <div className="checkbox-option" key={option.value}>
                  <input
                    type="checkbox"
                    id={`${fieldId}-${option.value}`}
                    name={fieldId}
                    value={option.value}
                    checked={((formValues[fieldId] as string[]) || []).includes(
                      option.value
                    )}
                    onChange={(e) =>
                      handleCheckboxChange(
                        fieldId,
                        option.value,
                        e.target.checked
                      )
                    }
                    data-testid={option.dataTestId}
                  />
                  <label htmlFor={`${fieldId}-${option.value}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </fieldset>
            {error && <div className="error-message">{error}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!formData || !currentSection) {
    return <div className="error">No form data available</div>;
  }

  return (
    <div className="dynamic-form">
      <h2>{formData.form.formTitle}</h2>

      <div className="form-progress">
        {formData.form.sections.map((section, index) => (
          <div
            key={section.sectionId}
            className={`progress-step ${
              index === currentSectionIndex ? "active" : ""
            } ${index < currentSectionIndex ? "completed" : ""}`}
          >
            {section.title}
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>{currentSection.title}</h3>
        <p className="section-description">{currentSection.description}</p>

        {currentSection.fields.map((field) => renderField(field))}

        <div className="form-actions">
          {currentSectionIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="prev-button"
              data-testid="prev-button"
            >
              Previous
            </button>
          )}

          {currentSectionIndex < formData.form.sections.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="next-button"
              data-testid="next-button"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="submit-button"
              data-testid="submit-button"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;
