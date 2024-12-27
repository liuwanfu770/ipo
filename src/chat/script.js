document.addEventListener("DOMContentLoaded", function () {
  const signalApiUrl = "http://localhost:8080/v2/send"; // Signal API 地址
  const contactDir = "../signal-cli/accounts"; // Signal 账号目录
  let selectedRecipient = null;

  // 动态加载联系人列表
  function loadContacts() {
    const contactList = document.getElementById("contactList");
    contactList.innerHTML = ""; // 清空联系人列表

    fetch(`${contactDir}`) // 替换为真实的后端 API 获取账号
      .then((res) => res.json())
      .then((contacts) => {
        contacts.forEach((contact) => {
          const contactItem = document.createElement("div");
          contactItem.className = "contact-item";
          contactItem.dataset.number = contact.number;
          contactItem.textContent = contact.name || contact.number;
          contactItem.addEventListener("click", () =>
            selectContact(contactItem)
          );
          contactList.appendChild(contactItem);
        });
      })
      .catch((err) => console.error("加载联系人失败:", err));
  }

  // 选择联系人
  function selectContact(contactItem) {
    document
      .querySelectorAll(".contact-item")
      .forEach((item) => item.classList.remove("active"));
    contactItem.classList.add("active");
    selectedRecipient = contactItem.dataset.number;
    console.log("已选择联系人:", selectedRecipient);
  }

  // 显示消息
  function displayMessage(content, isSent) {
    const messageElement = document.createElement("div");
    messageElement.className = isSent
      ? "chat-bubble user-message"
      : "chat-bubble system-message";
    messageElement.textContent = content;
    document.getElementById("chatContainer").appendChild(messageElement);
  }

  // 发送消息
  async function sendMessage() {
    if (!selectedRecipient) {
      alert("请选择联系人！");
      return;
    }

    const messageInput = document.getElementById("chatInputText");
    const messageContent = messageInput.value.trim();
    if (!messageContent) {
      alert("消息不能为空！");
      return;
    }

    const payload = {
      message: messageContent,
      recipient: selectedRecipient,
    };

    try {
      const response = await fetch(signalApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        displayMessage(messageContent, true); // 显示已发送消息
        messageInput.value = ""; // 清空输入框
      } else {
        console.error("发送失败");
      }
    } catch (error) {
      console.error("发送消息错误:", error);
    }
  }

  // 初始化
  loadContacts();
  document.getElementById("sendButton").addEventListener("click", sendMessage);
});
