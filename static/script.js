const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementsByClassName('chat-form');
const userInput = document.getElementById('user-input');
const input = document.getElementById("user-input");
const userText = input.value.trim();
const button = document.getElementById("btn")
const msg = document.createElement('div');

// console.log(chatForm[0])
// Add a message to the chat window
function addMessage(text, sender = 'bot') {
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle form submit
function send(){
  chatForm[0].addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = userInput.value.trim();
    // console.log(question)
    if (!question) return;
    // addMessage(question, 'user');
    appendMessage("user", question);
    userInput.value = '';
    addMessage('Thinking...', 'bot');
    try {
      const res = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      // Remove 'Thinking...' message
      chatWindow.removeChild(chatWindow.lastChild);
      // addMessage(data.answer, 'bot');
      setTimeout(() => appendMessage("bot", data.answer), 500);
    } catch (err) {
      chatWindow.removeChild(chatWindow.lastChild);
      addMessage('Sorry, I could not get an answer. Please try again.', 'bot');

    }
  });
}

const quickAsk = function(text) {
  // console.log("hello")
  input.value = text;
  chatForm[0].dispatchEvent(new Event('submit'));
}
// Quick question buttons

function appendMessage(sender, message) {
  const chat = document.getElementById("chat-window");
  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "user-bubble" : "bot-bubble";
  bubble.textContent = message;
  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;
}

