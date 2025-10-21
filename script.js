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
    showStatus("❌ Please fill in both fields.", "error");
    return;
  }

  showStatus("⏳ Generating proposal using AI...");
  generateBtn.disabled = true;

  try {
    const proposal = await simulateAIResponse(job, skills);
    outputBox.textContent = proposal;
    outputSection.classList.remove("hidden");
    showStatus("✅ Proposal generated successfully!", "success");
  } catch (err) {
    console.error(err);
    showStatus("⚠️ Something went wrong.", "error");
  } finally {
    generateBtn.disabled = false;
  }
});

// Handle copy
copyBtn.addEventListener("click", () => {
  const text = outputBox.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ Proposal copied to clipboard!");
  });
});

// Show messages
function showStatus(msg, type = "info") {
  statusMsg.textContent = msg;
  statusMsg.style.color =
    type === "error" ? "red" :
    type === "success" ? "green" :
    type === "info" ? "#333" : "#0d6efd";
}

// Clear previous result
function resetOutput() {
  outputBox.textContent = "";
  outputSection.classList.add("hidden");
  showStatus("");
}

// Simulated AI response (replace with OpenAI later)
function simulateAIResponse(job, skills) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`
Dear Client,

I was excited to see your posting and believe I’m an excellent fit for this opportunity.

With a background in ${skills}, I understand the core requirements of your project and am confident I can deliver high-quality results efficiently and professionally.

I’d be happy to discuss further how I can contribute to your goals.

Looking forward to hearing from you.

Best regards,  
[Your Name]
      `);
    }, 2000);
  });
}
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
