import Navbar from "../components/Navbar";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { useQuestionType } from "../context/QuestionTypeContext";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { determineQuestionType } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";
import { useLocation } from 'react-router-dom';
// import introJs from "intro.js";
// import "intro.js/introjs.css";
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

interface DivWithDropdownProps {
  textValue: string;
  index: number;
  onTypeChange: (index: number, type: string) => void;
  onQuestionTextChange: (index: number, newText: string) => void;
  initialQuestionText: string;
  initialType: string;
}

const DivWithDropdown: React.FC<DivWithDropdownProps> = ({
  textValue,
  index,
  onTypeChange,
  onQuestionTextChange,
  initialQuestionText,
  initialType,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [questionText, setQuestionText] = useState(initialQuestionText || "No text selected");
  const [selectedType, setSelectedType] = useState<string>(initialType || "Text");
  const [isOpen, setIsOpen] = useState(false);
  const { primaryValue } = determineQuestionType(textValue);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    onTypeChange(index, type);

    let newQuestionText = questionText;
    if (questionText === primaryValue || questionText === "No text selected") {
      if (type.toLowerCase() === "radio" && primaryValue) {
        newQuestionText = primaryValue;
      } else if (type.toLowerCase() === "text" && primaryValue) {
        newQuestionText = primaryValue;
      } else if (type.toLowerCase() === "number" && primaryValue) {
        newQuestionText = primaryValue;
      } else if (type.toLowerCase() === "date" && primaryValue) {
        newQuestionText = primaryValue;
      }
      setQuestionText(newQuestionText);
      onQuestionTextChange(index, newQuestionText);
    }
    setIsOpen(false);
  };

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setQuestionText(newText);
    onQuestionTextChange(index, newText);
  };

  const dropdownOptions = ["Text", "Paragraph", "Email", "Radio", "Number", "Date"];

  return (
    <div className="flex items-center space-x-8 w-full relative -top-[20vh]">
      <button className="flex flex-col justify-between h-10 w-12 p-1 transform hover:scale-105 transition-all duration-300">
        <span className={`block h-1 w-full rounded-full ${isDarkMode ? "bg-teal-400" : "bg-teal-600"}`}></span>
        <span className={`block h-1 w-full rounded-full ${isDarkMode ? "bg-teal-400" : "bg-teal-600"}`}></span>
        <span className={`block h-1 w-full rounded-full ${isDarkMode ? "bg-teal-400" : "bg-teal-600"}`}></span>
      </button>
      <div
        className={`relative w-full max-w-lg h-36 rounded-xl shadow-lg flex flex-col items-center justify-center text-lg font-semibold p-6 z-10 transform transition-all duration-300 hover:shadow-xl ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-700 to-gray-800 text-teal-200"
            : "bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-900"
        }`}
      >
        <div className="relative w-full flex items-center">
          <div className={`h-0.5 w-1/2 absolute left-0 opacity-50 ${isDarkMode ? "bg-teal-400" : "bg-teal-500"}`}></div>
          <input
            type="text"
            value={questionText}
            onChange={handleQuestionTextChange}
            className={`px-3 py-2 text-sm bg-transparent w-1/2 relative z-10 top-[-10px] max-w-full focus:outline-none transition-all duration-300 ${
              isDarkMode
                ? "border-b border-teal-400 text-teal-200 placeholder-teal-300/70 focus:border-cyan-400"
                : "border-b border-teal-400 text-teal-800 placeholder-teal-400/70 focus:border-cyan-500"
            }`}
            placeholder="Edit question text"
          />
        </div>

        <div id="text-option-button" className="absolute top-1/2 right-6 transform -translate-y-1/2 flex items-center space-x-2">
          <div className="relative">
            <button
              
              className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-lg shadow-md transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-600/80 text-teal-200 hover:bg-gray-500"
                  : "bg-white/80 text-teal-900 hover:bg-white"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{selectedType}</span>
              <FaChevronDown className={isDarkMode ? "text-teal-400" : "text-teal-600"} />
            </button>
            {isOpen && (
              <div
                id="open-drawer"
                className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${
                  isDarkMode
                    ? "bg-gray-700/90 backdrop-blur-sm border-gray-600"
                    : "bg-white/90 backdrop-blur-sm border-teal-100"
                }`}
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="hide-scrollbar">
                  {dropdownOptions.map((type) => (
                    <div
                      key={type}
                      className={`px-4 py-2 cursor-pointer transition-all duration-200 ${
                        isDarkMode
                          ? "text-teal-200 hover:bg-gray-600"
                          : "text-teal-800 hover:bg-teal-50"
                      }`}
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Questionnaire = () => {
  const location = useLocation();
  const { isDarkMode } = useContext(ThemeContext);
  const [leftActive, setLeftActive] = useState(true);
  const [rightActive, setRightActive] = useState(false);
  const { highlightedTexts } = useHighlightedText();
  const { selectedTypes, setSelectedTypes, editedQuestions, setEditedQuestions } = useQuestionType();
  const [uniqueQuestions, setUniqueQuestions] = useState<string[]>([]);
  const [duplicateDetected, setDuplicateDetected] = useState<boolean>(false);
  const [questionTexts, setQuestionTexts] = useState<string[]>([]);

  //
  // useEffect(() => {
  //   const intro = introJs();
  
  //   intro.setOptions({
  //     steps: [
  //       {
  //         intro: "Welcome to the Questionnaire Page! Here, you can manage and customize the questions generated from the selected placeholders.",
  //         tooltipClass: "introjs-tooltip-left-bottom",
  //       },
  //       {
  //         element: document.querySelector("#text-option-button") as HTMLElement, 
  //         intro: "Click here to select the placeholder type. Choose 'Text' for text-based questions.",
  //         tooltipClass: "introjs-tooltip-bottom-center", 
  //       },
  //       {
  //         element: document.querySelector("#live-document-generation") as HTMLElement, 
  //         intro: "Click here to go to Document Generation. This is where you can generate the final document based on your selections.",
  //         tooltipClass: "introjs-tooltip-top", 
  //       },
  //     ],
  //     showProgress: false,
  //     showBullets: false,
  //     exitOnOverlayClick: true, // Allow the user to exit by clicking outside
  //     disableInteraction: false,
  //     hidePrev: true,
  //     hideNext: false,
  //     nextLabel: "Next →",
  //     doneLabel: "Done",
  //   });
  
   
  //   intro.start();
  // }, []);


  useEffect(() => {
    if (!location.state?.startTour) return;
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: "shadow-md bg-purple-dark",
        scrollTo: { behavior: "smooth", block: "center" },
      },
      useModalOverlay: true, 
    });
  
    // Step 1: Welcome message
    tour.addStep({
      id: "welcome-to-questionnaire",
      text: "<strong>Welcome to the Questionnaire forge!😊</strong> <br> Here, you craft the questions that feed your placeholders. See the default question text for [Employer Name]? Go ahead and tweak it if you desire—like 'Provide the name of the Employer:",
      attachTo: { element: "body", on: "bottom-start" },
      buttons: [{ text: "Next →", action: tour.next }],
    });
  
    // Step 2: Click on Placeholder Type
    tour.addStep({
      id: "placeholder-type",
      text: "Click here to select the <strong>placeholder type </strong>. Choose 'Text' for text-based questions.",
      attachTo: { element: "#text-option-button", on: "right" },
      when: {
        show: () => {
          const button = document.getElementById("text-option-button");
          if (button) {
            button.addEventListener("click", () => {
              setTimeout(() => {
                const dropdown = document.getElementById("open-drawer");
                if (dropdown) {
                  tour.next(); // Move to the dropdown selection step
                }
              }, 300); // Wait for dropdown animation
            });
          }
        },
      },
    });
  
    // Step 3: Guide inside the dropdown (Fixed Flashing Issue)
    tour.addStep({
      id: "option-drawer",
      text: "Select an option from the list. You can choose Text, Paragraph, or Email according to question type.",
      attachTo: { element: "#open-drawer", on: "right" },
      when: {
        show: () => {
          setTimeout(() => {
            const dropdown = document.getElementById("open-drawer");
            if (dropdown && window.getComputedStyle(dropdown).display !== "none") {
              dropdown.addEventListener("click", (event) => {
                if ((event.target as HTMLElement).tagName === "DIV") {
                  setTimeout(() => tour.next(), -100); // Slight delay to avoid flickering
                }
              });
            } else {
              tour.next(); // Skip step if dropdown is already closed
            }
          }, 300); // Wait for full dropdown rendering
        },
      },
    });
  
    // Step 4: Go to Document Generation
    tour.addStep({
      id: "live-generation",
      text: "Time to see your automation in action! Click 'Live Document Generation' to test your work. On this page, find the answer field tied to [Employer Name]. Type in 'John Doe' as the employer’s name, then hit Next' to witness the magic. Watch as [Employer Name] transforms into 'John Doe' in the document!",
      attachTo: { element: "#live-document-generation", on: "right" },
      buttons: [{ text: "Done", action: tour.complete }],
    });
  
    tour.start();
  
    return () => {
      tour.complete();
    };
  }, [location.state]);
  
  



  useEffect(() => {
    const processedTexts: string[] = [];
    const questionMap = new Map();

    for (const text of highlightedTexts) {
      const { primaryValue } = determineQuestionType(text);
      if (primaryValue && !questionMap.has(primaryValue)) {
        questionMap.set(primaryValue, text);
        processedTexts.push(text);
      } else if (primaryValue && questionMap.get(primaryValue) === text) {
        setDuplicateDetected(true);
        setTimeout(() => setDuplicateDetected(false), 3000);
      }
    }

    setUniqueQuestions(processedTexts);

    if (
      selectedTypes.length !== processedTexts.length ||
      editedQuestions.length !== processedTexts.length
    ) {
      const initialTexts = processedTexts.map(
        (text) => determineQuestionType(text).primaryValue || "No text selected"
      );
      const initialTypes = processedTexts.map((text) => {
        const { primaryType } = determineQuestionType(text);
        return primaryType !== "Unknown" ? primaryType : "Text";
      });

      setQuestionTexts(initialTexts);
      setSelectedTypes(initialTypes);
      setEditedQuestions(initialTexts);
    } else {
      setQuestionTexts([...editedQuestions]);
    }
  }, [highlightedTexts, selectedTypes.length, editedQuestions.length, setSelectedTypes, setEditedQuestions]);

  const handleTypeChange = (index: number, type: string) => {
    const newTypes = [...selectedTypes];
    newTypes[index] = type;
    setSelectedTypes(newTypes);

    const textValue = uniqueQuestions[index];
    const { primaryValue } = determineQuestionType(textValue);
    const newTexts = [...questionTexts];
    if (
      newTexts[index] === primaryValue ||
      newTexts[index] === "No text selected"
    ) {
      if (type.toLowerCase() === "radio" && primaryValue) {
        newTexts[index] = primaryValue;
      } else if (type.toLowerCase() === "text" && primaryValue) {
        newTexts[index] = primaryValue;
      } else if (type.toLowerCase() === "number" && primaryValue) {
        newTexts[index] = primaryValue;
      } else if (type.toLowerCase() === "date" && primaryValue) {
        newTexts[index] = primaryValue;
      }
      setQuestionTexts(newTexts);
      setEditedQuestions(newTexts);
    }
  };

  const handleQuestionTextChange = (index: number, newText: string) => {
    const newTexts = [...questionTexts];
    newTexts[index] = newText;
    setQuestionTexts(newTexts);
    setEditedQuestions(newTexts);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      <Navbar />
      <div
        className={`absolute top-16 right-6 w-80 h-12 rounded-xl shadow-lg flex items-center justify-center text-sm font-semibold z-20 ${
          isDarkMode
            ? "bg-gradient-to-r from-gray-700 to-gray-800 text-teal-200"
            : "bg-gradient-to-r from-teal-200 to-cyan-200 text-teal-900"
        }`}
      >
        <div className="flex items-center space-x-6">
          <div
            className={`flex items-center space-x-2 ${
              leftActive ? (isDarkMode ? "text-teal-400" : "text-teal-600") : (isDarkMode ? "text-cyan-400" : "text-cyan-500")
            } transition-all duration-300`}
          >
            <span>Employer</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setLeftActive(true);
                setRightActive(false);
              }}
              className={`${isDarkMode ? "text-teal-400 hover:text-cyan-400" : "text-teal-600 hover:text-cyan-500"} transform hover:scale-110 transition-all duration-300`}
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <button
              onClick={() => {
                setRightActive(true);
                setLeftActive(false);
              }}
              className={`${isDarkMode ? "text-teal-400 hover:text-cyan-400" : "text-teal-600 hover:text-cyan-500"} transform hover:scale-110 transition-all duration-300`}
            >
              <FaChevronRight className="text-xl" />
            </button>
          </div>
          <div
            className={`flex items-center space-x-2 ${
              rightActive ? (isDarkMode ? "text-teal-400" : "text-teal-600") : (isDarkMode ? "text-cyan-400" : "text-cyan-500")
            } transition-all duration-300`}
          >
            <span>Employee</span>
          </div>
        </div>
      </div>

      {duplicateDetected && (
        <div
          className={`absolute top-28 right-6 p-4 rounded-xl shadow-md transition-opacity duration-400 z-10 animate-fadeIn ${
            isDarkMode
              ? "bg-gradient-to-r from-yellow-800 to-yellow-900 border-l-4 border-yellow-500 text-yellow-200"
              : "bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-400 text-yellow-800"
          }`}
        >
          <p className="font-bold">Duplicate Question</p>
          <p className="text-sm">This question already exists in the questionnaire.</p>
        </div>
      )}

      <div className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-y-auto">
        <div className="space-y-12 w-full max-w-4xl">
          {uniqueQuestions.length > 0 ? (
            uniqueQuestions.map((text, index) => (
              <DivWithDropdown
                key={index}
                textValue={text}
                index={index}
                onTypeChange={handleTypeChange}
                onQuestionTextChange={handleQuestionTextChange}
                initialQuestionText={questionTexts[index] || editedQuestions[index] || "No text selected"}
                initialType={selectedTypes[index] || "Text"}
              />
            ))
          ) : (
            <div
              className={`text-center py-12 rounded-xl shadow-lg border ${
                isDarkMode
                  ? "bg-gray-800/80 backdrop-blur-sm border-gray-700/20"
                  : "bg-white/80 backdrop-blur-sm border-teal-100/20"
              }`}
            >
              <p
                className={`text-lg font-medium ${
                  isDarkMode ? "text-teal-300" : "text-teal-700"
                }`}
              >
                No text has been selected yet.
              </p>
              <p
                className={`text-sm mt-2 ${
                  isDarkMode ? "text-teal-400" : "text-teal-500"
                }`}
              >
                Go to the Document tab and select text in square brackets to generate questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
