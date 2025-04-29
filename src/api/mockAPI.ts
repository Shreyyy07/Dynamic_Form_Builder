import { FormResponse } from "../types";

export interface LoginCredentials {
  rollNumber: string;
  name: string;
}
const mockFormData: FormResponse = {
  message: "Form fetched successfully",
  form: {
    formTitle: "Student Information Form",
    formId: "student-info-form",
    version: "1.0",
    sections: [
      {
        sectionId: 1,
        title: "Personal Information",
        description: "Please provide your personal details",
        fields: [
          {
            fieldId: "fullName",
            type: "text",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
            dataTestId: "fullName-input",
            validation: {
              message: "Full name is required",
            },
            minLength: 3,
            maxLength: 50,
          },
          {
            fieldId: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
            dataTestId: "email-input",
            validation: {
              message: "Please enter a valid email address",
            },
          },
          {
            fieldId: "dob",
            type: "date",
            label: "Date of Birth",
            required: true,
            dataTestId: "dob-input",
            validation: {
              message: "Date of birth is required",
            },
          },
        ],
      },
      {
        sectionId: 2,
        title: "Contact Information",
        description: "Please provide your contact details",
        fields: [
          {
            fieldId: "mobileNumber",
            type: "tel",
            label: "Mobile Number",
            placeholder: "Enter your mobile number",
            required: true,
            dataTestId: "mobile-input",
            validation: {
              message: "Mobile number is required",
            },
            minLength: 10,
            maxLength: 10,
          },
          {
            fieldId: "address",
            type: "textarea",
            label: "Address",
            placeholder: "Enter your address",
            required: true,
            dataTestId: "address-input",
            validation: {
              message: "Address is required",
            },
            minLength: 10,
          },
        ],
      },
      {
        sectionId: 3,
        title: "Educational Information",
        description: "Please provide your educational details",
        fields: [
          {
            fieldId: "highestQualification",
            type: "dropdown",
            label: "Highest Qualification",
            required: true,
            dataTestId: "qualification-dropdown",
            validation: {
              message: "Please select your highest qualification",
            },
            options: [
              {
                value: "highSchool",
                label: "High School",
                dataTestId: "highSchool-option",
              },
              {
                value: "bachelor",
                label: "Bachelor's Degree",
                dataTestId: "bachelor-option",
              },
              {
                value: "master",
                label: "Master's Degree",
                dataTestId: "master-option",
              },
              {
                value: "phd",
                label: "PhD",
                dataTestId: "phd-option",
              },
            ],
          },
          {
            fieldId: "branch",
            type: "radio",
            label: "Branch of Study",
            required: true,
            dataTestId: "branch-radio",
            validation: {
              message: "Please select your branch of study",
            },
            options: [
              {
                value: "cs",
                label: "Computer Science",
                dataTestId: "cs-option",
              },
              {
                value: "it",
                label: "Information Technology",
                dataTestId: "it-option",
              },
              {
                value: "ec",
                label: "Electronics & Communication",
                dataTestId: "ec-option",
              },
              {
                value: "me",
                label: "Mechanical Engineering",
                dataTestId: "me-option",
              },
            ],
          },
          {
            fieldId: "interests",
            type: "checkbox",
            label: "Areas of Interest",
            required: true,
            dataTestId: "interests-checkbox",
            validation: {
              message: "Please select at least one area of interest",
            },
            options: [
              {
                value: "webDev",
                label: "Web Development",
                dataTestId: "webDev-option",
              },
              {
                value: "mobileDev",
                label: "Mobile Development",
                dataTestId: "mobileDev-option",
              },
              {
                value: "ai",
                label: "Artificial Intelligence",
                dataTestId: "ai-option",
              },
              {
                value: "dataScience",
                label: "Data Science",
                dataTestId: "dataScience-option",
              },
            ],
          },
        ],
      },
    ],
  },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createUser = async (
  credentials: LoginCredentials
): Promise<{ success: boolean; message: string }> => {
  try {
    await delay(800);

    if (!credentials.rollNumber || !credentials.name) {
      throw new Error("Roll number and name are required");
    }
    localStorage.setItem("user", JSON.stringify(credentials));

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create user",
    };
  }
};

export const getForm = async (): Promise<FormResponse> => {
  try {
    await delay(1000);

    const loginStatus = sessionStorage.getItem("isLoggedIn");
    if (loginStatus !== "true") {
      throw new Error("User not logged in");
    }

    const userData = localStorage.getItem("user");
    if (!userData) {
      throw new Error("User data not found");
    }

    const user = JSON.parse(userData) as LoginCredentials;
    const customizedForm = { ...mockFormData };
    customizedForm.form.formTitle = `${user.name}'s Information Form`;

    return customizedForm;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch form"
    );
  }
};

export const validateLogin = async (
  credentials: LoginCredentials
): Promise<{ success: boolean; message: string }> => {
  try {
    await delay(800);

    const userData = localStorage.getItem("user");

    if (!userData) {
      return {
        success: false,
        message: "User not found. Please register first.",
      };
    }

    const user = JSON.parse(userData) as LoginCredentials;

    if (
      user.rollNumber === credentials.rollNumber &&
      user.name === credentials.name
    ) {
      sessionStorage.setItem("isLoggedIn", "true");
      return {
        success: true,
        message: "Login successful",
      };
    } else {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};
