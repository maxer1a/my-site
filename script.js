// Select elements
const form = document.getElementById("proposalForm");
const jobField = document.getElementById("jobDescription");
const skillsField = document.getElementById("skills");
const outputSection = document.getElementById("outputSection");
const outputBox = document.getElementById("proposalOutput");
const copyBtn = document.getElementById("copyBtn");
const generateBtn = document.getElementById("generateBtn");
const statusMsg = document.getElementById("statusMessage");

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  resetOutput();

  const job = jobField.value.trim();
  const skills = skillsField.value.trim();

  if (!job || !skills) {
    showStatus("Please fill in both fields.", "error");
    return;
  }

  showStatus("Generating proposal...");
  generateBtn.disabled = true;

  try {
    const proposal = await generateProposal(job, skills);
    outputBox.textContent = proposal;
    outputSection.classList.remove("hidden");
    showStatus("Proposal generated successfully.", "success");
  } catch (err) {
    console.error(err);
    showStatus("An error occurred while generating proposal.", "error");
  } finally {
    generateBtn.disabled = false;
  }
});

// Copy to clipboard
copyBtn.addEventListener("click", () => {
  const text = outputBox.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Proposal copied to clipboard!");
  });
});

// Show status message
function showStatus(msg, type = "info") {
  statusMsg.textContent = msg;
  statusMsg.style.color =
    type === "error" ? "red" :
    type === "success" ? "green" :
    "#333";
}

// Reset output
function resetOutput() {
  outputBox.textContent = "";
  outputSection.classList.add("hidden");
  showStatus("");
}

// Real backend call to generate proposal using OpenAI API
async function generateProposal(job, skills) {
  const response = await fetch('http://localhost:3000/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jobDescription: job,
      userSkills: skills
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate proposal from API');
  }

  const data = await response.json();
  return data.proposal;
}
