// ============================================================================
// SGP CONNECT AI ACADEMIC ASSISTANT SERVICE
// Google Gemini API Integration with Smart Context Fallback
// ============================================================================

export async function askAIAssistant(prompt, studentContext) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // If live Gemini API key is configured in .env, call Gemini API
  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are the AI Academic Assistant for Sanjay Gandhi Polytechnic, Bellary.
Here is the authenticated student context:
Name: ${studentContext.name} (${studentContext.usn})
Department: ${studentContext.department}
Class: ${studentContext.className}
Overall Attendance: ${studentContext.overallAttendance}% (Present: ${studentContext.presentCount}/${studentContext.totalClasses})
Applicable Fine: ₹${studentContext.applicableFine}
Next Class: ${studentContext.nextClass?.subjectName || 'None'} (${studentContext.nextClass?.startTime || ''} in ${studentContext.nextClass?.room || ''})

Student Question: "${prompt}"

Provide a helpful, precise, friendly academic response. If they ask about attendance, shortage, notes, or next class, reference their real data above.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn('[AI Service] Gemini call failed, falling back to local academic parser:', err);
    }
  }

  // Smart Context-Aware Local Academic Response Generator
  const query = prompt.toLowerCase();

  // Next Class Query
  if (query.includes('next class') || query.includes('what class') || query.includes('next lecture') || query.includes('upcoming class')) {
    if (studentContext.nextClass) {
      return `📅 **Your Next Class**:
• **Subject**: ${studentContext.nextClass.subjectName}
• **Time**: ${studentContext.nextClass.startTime} – ${studentContext.nextClass.endTime}
• **Venue**: ${studentContext.nextClass.room}
• **Faculty**: ${studentContext.nextClass.teacherName}

Make sure you are seated and ready to scan the dynamic attendance QR code!`;
    }
    return `You have completed all scheduled classes for today! Check your timetable tab for tomorrow's schedule.`;
  }

  // Attendance & Shortage Query
  if (query.includes('attendance') || query.includes('percentage') || query.includes('shortage') || query.includes('present')) {
    const isShortage = studentContext.overallAttendance < 75;
    let advice = isShortage
      ? `⚠️ **Attendance Shortage Alert**: Your attendance is ${studentContext.overallAttendance}%, which is below the mandatory 75% threshold. You need to attend **${studentContext.classesNeeded} consecutive classes** without absence to restore your standing.`
      : `✅ **Safe Standing**: Your overall attendance is **${studentContext.overallAttendance}%** (${studentContext.presentCount} of ${studentContext.totalClasses} classes attended). You are well above the 75% polytechnic board threshold!`;

    if (query.includes('dbms')) {
      advice += `\n\n📊 **DBMS Specific Attendance**: 38/42 classes attended (**90.5%** - Outstanding).`;
    } else if (query.includes('network')) {
      advice += `\n\n⚠️ **Networking Specific Attendance**: 28/38 classes attended (**73.7%** - Shortage warning).`;
    }

    return advice;
  }

  // Fine Query
  if (query.includes('fine') || query.includes('penalty') || query.includes('fee')) {
    if (studentContext.applicableFine > 0) {
      return `💰 **Attendance Fine Status**:
Based on your current attendance of **${studentContext.overallAttendance}%**, the applicable college shortage fine is **₹${studentContext.applicableFine}**.
Please contact HOD Prof. Anitha or attend the next batch of classes to improve your percentage before final semester exam hall tickets are generated.`;
    }
    return `🎉 **No Fine Applicable**: Your overall attendance is **${studentContext.overallAttendance}%**, which is above the 75% minimum threshold. Your fine is **₹0**. Keep it up!`;
  }

  // Internal Exam / IA Query
  if (query.includes('exam') || query.includes('ia') || query.includes('internal test') || query.includes('marks')) {
    return `📝 **Internal Assessment Information**:
• **Upcoming Exam**: IA-2 commences on **05 October 2026** for 5th Sem CSE.
• **Your Current IA-1 Standing**:
  - DBMS: 18 / 20 (Distinction)
  - Java: 16 / 20 (Distinction)
  - Maths: 14 / 20 (First Class)
  - Networking: 15 / 20 (First Class)
• **Tips**: Unit 3 Normalization and Java Inheritance will carry 40% weightage in IA-2.`;
  }

  // Assignment Query
  if (query.includes('assignment') || query.includes('homework') || query.includes('due') || query.includes('deadline')) {
    return `📋 **Pending Assignments**:
1. **DBMS**: *Normalization Case Study (Library Schema)* — Due **28 September 2026** (Points: 20). Status: Not submitted yet.
2. **Java**: *Multithreading & Exception Mini Project* — Due **02 October 2026** (Points: 20). Status: In progress.

You can submit your PDF / code solution directly in the Assignments tab!`;
  }

  // Explain Normalization Query (Section 36 Study Assistant)
  if (query.includes('normalization') || query.includes('1nf') || query.includes('2nf') || query.includes('3nf') || query.includes('bcnf')) {
    return `📚 **DBMS Study Summary: Normalization Simplified**:

Normalization is the process of organizing database tables to minimize **redundancy** and prevent **anomalies** (Insertion, Deletion, Update).

1. **1NF (First Normal Form)**:
   - Every column must contain atomic (single, indivisible) values.
   - No multi-valued attributes or repeating groups.

2. **2NF (Second Normal Form)**:
   - Must already be in 1NF.
   - **No Partial Dependency**: Every non-key attribute must be fully functionally dependent on the entire Primary Key.

3. **3NF (Third Normal Form)**:
   - Must already be in 2NF.
   - **No Transitive Dependency**: Non-prime attributes must not depend on other non-prime attributes ($X \\to Y$ where neither is a key).

4. **BCNF (Boyce-Codd Normal Form)**:
   - For every functional dependency $X \\to Y$, $X$ must be a **Super Key**.

💡 *Tip from Prof. Anitha*: Practice converting unnormalized tables from Unit 3 Question Bank before the IA-2 test!`;
  }

  // Practice Quiz / Questions Query
  if (query.includes('quiz') || query.includes('practice question') || query.includes('test me') || query.includes('question')) {
    return `🎯 **SGP Flash Quiz — DBMS Normalization (IA-2 Prep)**:

**Q1**: If a relation has a composite primary key $(A, B)$ and a dependency $A \\to C$ exists where $C$ is a non-key attribute, which normal form is violated?
*Hint: Partial Dependency violates 2NF.*

**Q2**: What is the condition for a functional dependency $X \\to Y$ in Boyce-Codd Normal Form (BCNF)?
*Hint: $X$ must be a super key.*

**Q3**: Why is normalization beneficial in transactional banking systems?
*Hint: Eliminates duplicate data and avoids update anomalies.*

Would you like the full answers and step-by-step proofs?`;
  }

  // General polytechnic college greeting & help
  return `Hello Rahul! 👋 I am your SGP Connect Academic Assistant. I can assist you with:
• Checking your **next class**, timetable, and lecture hall.
• Viewing your real-time **attendance**, shortage, and fine details.
• Explaining topics from **Study Materials** (e.g. DBMS Normalization, Java Threads).
• Generating **practice questions** and summaries for IA-2 exams.
• Tracking **assignment deadlines**.

What would you like assistance with today?`;
}
