// Joymiz CV - Application Logic
(function() {
  'use strict';

  let currentStep = 1;
  let experienceCount = 0;
  let educationCount = 0;
  let skills = [];

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    addExperience();
    addEducation();
    setupSkillsInput();
    setupStepIndicator();
    setupLivePreview();
  });

  // Step Navigation
  window.nextStep = function(step) {
    if (step > 1 && !validateStep(currentStep)) return;
    goToStep(step);
  };

  window.prevStep = function(step) {
    goToStep(step);
  };

  function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(function(el) {
      el.classList.remove('active');
    });
    document.getElementById('step' + step).classList.add('active');

    document.querySelectorAll('.step-indicator .step').forEach(function(el, i) {
      el.classList.remove('active', 'completed');
      if (i + 1 === step) el.classList.add('active');
      else if (i + 1 < step) el.classList.add('completed');
    });

    currentStep = step;
    updatePreview();
  }

  function validateStep(step) {
    if (step === 1) {
      var name = document.getElementById('fullName').value.trim();
      if (!name) {
        document.getElementById('fullName').focus();
        return false;
      }
    }
    return true;
  }

  // Step Indicator Click
  function setupStepIndicator() {
    document.querySelectorAll('.step-indicator .step').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var step = parseInt(this.dataset.step);
        if (step <= currentStep || validateStep(currentStep)) {
          goToStep(step);
        }
      });
    });
  }

  // Experience
  window.addExperience = function() {
    experienceCount++;
    var container = document.getElementById('experienceEntries');
    var div = document.createElement('div');
    div.className = 'entry-block';
    div.id = 'exp-' + experienceCount;
    div.innerHTML =
      '<div class="entry-header">' +
        '<span class="entry-number">Experience ' + experienceCount + '</span>' +
        '<button class="btn-remove-entry" onclick="removeExperience(' + experienceCount + ')">Remove</button>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group">' +
          '<label>Job Title *</label>' +
          '<input type="text" class="exp-title" placeholder="Software Engineer" oninput="updatePreview()">' +
        '</div>' +
        '<div class="form-group">' +
          '<label>Company *</label>' +
          '<input type="text" class="exp-company" placeholder="Acme Corp" oninput="updatePreview()">' +
        '</div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group">' +
          '<label>Start Date</label>' +
          '<input type="text" class="exp-start" placeholder="Jan 2020" oninput="updatePreview()">' +
        '</div>' +
        '<div class="form-group">' +
          '<label>End Date</label>' +
          '<input type="text" class="exp-end" placeholder="Present" oninput="updatePreview()">' +
        '</div>' +
      '</div>' +
      '<div class="form-group">' +
        '<label>Description</label>' +
        '<textarea class="exp-desc" rows="3" placeholder="Describe your responsibilities and achievements..." oninput="updatePreview()"></textarea>' +
      '</div>';
    container.appendChild(div);
    updatePreview();
  };

  window.removeExperience = function(id) {
    var el = document.getElementById('exp-' + id);
    if (el) {
      el.remove();
      updatePreview();
    }
  };

  // Education
  window.addEducation = function() {
    educationCount++;
    var container = document.getElementById('educationEntries');
    var div = document.createElement('div');
    div.className = 'entry-block';
    div.id = 'edu-' + educationCount;
    div.innerHTML =
      '<div class="entry-header">' +
        '<span class="entry-number">Education ' + educationCount + '</span>' +
        '<button class="btn-remove-entry" onclick="removeEducation(' + educationCount + ')">Remove</button>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group">' +
          '<label>School / University *</label>' +
          '<input type="text" class="edu-school" placeholder="University of Example" oninput="updatePreview()">' +
        '</div>' +
        '<div class="form-group">' +
          '<label>Degree / Certificate *</label>' +
          '<input type="text" class="edu-degree" placeholder="B.Sc. Computer Science" oninput="updatePreview()">' +
        '</div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group">' +
          '<label>Start Date</label>' +
          '<input type="text" class="edu-start" placeholder="Sep 2016" oninput="updatePreview()">' +
        '</div>' +
        '<div class="form-group">' +
          '<label>End Date</label>' +
          '<input type="text" class="edu-end" placeholder="Jun 2020" oninput="updatePreview()">' +
        '</div>' +
      '</div>';
    container.appendChild(div);
    updatePreview();
  };

  window.removeEducation = function(id) {
    var el = document.getElementById('edu-' + id);
    if (el) {
      el.remove();
      updatePreview();
    }
  };

  // Skills
  function setupSkillsInput() {
    var input = document.getElementById('skillInput');
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addSkill(this.value);
        this.value = '';
      }
      if (e.key === 'Backspace' && !this.value && skills.length > 0) {
        removeSkill(skills.length - 1);
      }
    });

    input.addEventListener('blur', function() {
      if (this.value.trim()) {
        addSkill(this.value);
        this.value = '';
      }
    });
  }

  function addSkill(value) {
    var skill = value.trim().replace(/,/g, '');
    if (!skill || skills.indexOf(skill) !== -1) return;
    skills.push(skill);
    renderSkills();
    updatePreview();
  }

  window.removeSkill = function(index) {
    skills.splice(index, 1);
    renderSkills();
    updatePreview();
  };

  function renderSkills() {
    var container = document.getElementById('skillsContainer');
    var input = document.getElementById('skillInput');
    // Remove existing tags
    container.querySelectorAll('.skill-tag').forEach(function(el) { el.remove(); });
    // Add tags before input
    skills.forEach(function(skill, i) {
      var tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.innerHTML = skill + ' <button onclick="removeSkill(' + i + ')">&times;</button>';
      container.insertBefore(tag, input);
    });
  }

  // Live Preview
  function setupLivePreview() {
    var inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
      input.addEventListener('input', updatePreview);
    });
  }

  window.updatePreview = function() {
    var data = getFormData();
    var isEmpty = !data.fullName && !data.summary && data.experience.length === 0 && data.education.length === 0 && skills.length === 0;

    if (isEmpty) {
      document.getElementById('cvEmpty').style.display = 'block';
      document.getElementById('cvContent').style.display = 'none';
      return;
    }

    document.getElementById('cvEmpty').style.display = 'none';
    document.getElementById('cvContent').style.display = 'block';

    var template = document.getElementById('templateSelect').value;
    document.getElementById('cvPreview').className = 'cv-preview cv-' + template;

    var html = '';

    // Name
    if (data.fullName) {
      html += '<div class="cv-name">' + escapeHtml(data.fullName) + '</div>';
    }

    // Contact
    var contactItems = [];
    if (data.email) contactItems.push(escapeHtml(data.email));
    if (data.phone) contactItems.push(escapeHtml(data.phone));
    if (data.location) contactItems.push(escapeHtml(data.location));
    if (data.linkedin) contactItems.push(escapeHtml(data.linkedin));
    if (data.website) contactItems.push(escapeHtml(data.website));

    if (contactItems.length > 0) {
      html += '<div class="cv-contact">' + contactItems.map(function(item) {
        return '<span>' + item + '</span>';
      }).join('') + '</div>';
    }

    // Summary
    if (data.summary) {
      html += '<div class="cv-section">';
      html += '<div class="cv-section-title">Professional Summary</div>';
      html += '<p>' + escapeHtml(data.summary) + '</p>';
      html += '</div>';
    }

    // Experience
    if (data.experience.length > 0) {
      html += '<div class="cv-section">';
      html += '<div class="cv-section-title">Work Experience</div>';
      data.experience.forEach(function(exp) {
        if (!exp.title && !exp.company) return;
        html += '<div class="cv-entry">';
        html += '<div class="cv-entry-header">';
        html += '<span class="cv-entry-title">' + escapeHtml(exp.title || '') + '</span>';
        var dates = [exp.start, exp.end].filter(Boolean).join(' - ');
        if (dates) html += '<span class="cv-entry-date">' + escapeHtml(dates) + '</span>';
        html += '</div>';
        if (exp.company) html += '<div class="cv-entry-subtitle">' + escapeHtml(exp.company) + '</div>';
        if (exp.desc) html += '<div class="cv-entry-desc">' + escapeHtml(exp.desc) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Education
    if (data.education.length > 0) {
      html += '<div class="cv-section">';
      html += '<div class="cv-section-title">Education</div>';
      data.education.forEach(function(edu) {
        if (!edu.school && !edu.degree) return;
        html += '<div class="cv-entry">';
        html += '<div class="cv-entry-header">';
        html += '<span class="cv-entry-title">' + escapeHtml(edu.degree || '') + '</span>';
        var dates = [edu.start, edu.end].filter(Boolean).join(' - ');
        if (dates) html += '<span class="cv-entry-date">' + escapeHtml(dates) + '</span>';
        html += '</div>';
        if (edu.school) html += '<div class="cv-entry-subtitle">' + escapeHtml(edu.school) + '</div>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Skills
    if (skills.length > 0) {
      html += '<div class="cv-section">';
      html += '<div class="cv-section-title">Skills</div>';
      html += '<div class="cv-skills-list">';
      skills.forEach(function(skill) {
        html += '<span class="cv-skill-tag">' + escapeHtml(skill) + '</span>';
      });
      html += '</div>';
      html += '</div>';
    }

    document.getElementById('cvContent').innerHTML = html;
  };

  function getFormData() {
    var data = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      location: document.getElementById('location').value.trim(),
      linkedin: document.getElementById('linkedin').value.trim(),
      website: document.getElementById('website').value.trim(),
      summary: document.getElementById('summary').value.trim(),
      experience: [],
      education: []
    };

    document.querySelectorAll('#experienceEntries .entry-block').forEach(function(block) {
      data.experience.push({
        title: block.querySelector('.exp-title').value.trim(),
        company: block.querySelector('.exp-company').value.trim(),
        start: block.querySelector('.exp-start').value.trim(),
        end: block.querySelector('.exp-end').value.trim(),
        desc: block.querySelector('.exp-desc').value.trim()
      });
    });

    document.querySelectorAll('#educationEntries .entry-block').forEach(function(block) {
      data.education.push({
        school: block.querySelector('.edu-school').value.trim(),
        degree: block.querySelector('.edu-degree').value.trim(),
        start: block.querySelector('.edu-start').value.trim(),
        end: block.querySelector('.edu-end').value.trim()
      });
    });

    return data;
  }

  // Template Change
  window.changeTemplate = function() {
    updatePreview();
  };

  // Download PDF
  window.downloadCV = function() {
    window.print();
  };

  // Utility
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

})();
