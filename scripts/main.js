(function () {
  const CARD_TYPES = { TASK: 'TASK', BUG: 'BUG', OTHER: 'OTHER' };
  let cards = [];

  function getCardData(row) {
    const columns = row.getElementsByTagName('td');

    if (columns.length) {
      const link = row.querySelector('.issue-link');
      const cardType = row.querySelector('.issuetype').innerText.trim().toUpperCase();

      return {
        id: link.innerText.trim(),
        link: link.href,
        type: CARD_TYPES[cardType] || CARD_TYPES.OTHER,
        summary: row.querySelector('.summary').innerText.trim(),
      };
    }

    return null;
  }

  function initHtml() {
    const container = document.createElement('div');
    const cardGroupByType = cards.reduce((result, item) => {
      result[item.type] = result[item.type] || [];
      result[item.type].push(item);
      return result;
    }, {});

    for (const type in cardGroupByType) {
      const list = cardGroupByType[type];
      const header = document.createElement('h2');
      header.innerText = type;
      container.appendChild(header);
      const ul = document.createElement('ul');

      for (let i = 0; i < list.length; i++) {
        const data = list[i];
        const li = document.createElement('li');
        const content = `[<a href="${data.link}">${data.id}</a>] - ${data.summary}`;
        li.innerHTML = content;
        ul.appendChild(li);
      }

      container.appendChild(ul);
    }

    return container;
  }

  document.querySelector('#file').addEventListener('change', function (event) {
    const { files } = event.target;
    const file = files[0];
    cards = [];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const content = e.target.result;
        const el = document.createElement('div');
        el.innerHTML = content;
        const rows = el.getElementsByClassName('issuerow');

        if (rows.length) {
          for (let i = 0; i < rows.length; i++) {
            const rowData = getCardData(rows[i]);
            rowData && cards.push(rowData);
          }
        }

        const html = initHtml();
        document.querySelector('#release-text__container').innerHTML = html.innerHTML;
        document.querySelector('#release-html__editor').value = html.innerHTML;
      };

      reader.readAsText(file);
    }
  });
})();
