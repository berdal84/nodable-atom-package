'use babel';

export default class NodableView {

  constructor(serializedState)
  {
    this.visible = false;
    this.textBuffer = '';

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('nodable');
    this.element.classList.add('pointer-events-none');

    // Main div
    this.mainDiv = document.createElement('div');
    this.mainDiv.classList.add('pointer-events-all');
    this.element.appendChild(this.mainDiv);

    // Title
    this.titleDiv = document.createElement('div');
    this.mainDiv.appendChild(this.titleDiv);

    // Div to display nodable buffer
    this.textInput = document.createElement('input');
    this.textInput.type = 'textarea'
    this.textInput.rows = 10;
    this.textInput.cols = 50;
    this.textInput.readOnly = false;
    this.mainDiv.appendChild(this.textInput);

    // Update Atom button
    const updateAtom = document.createElement('button');
    updateAtom.innerText = 'Nodable to Atom';
    updateAtom.addEventListener("click", () => this.updateAtom() );
    this.mainDiv.appendChild(updateAtom);

    // Update Nodable button
    const updateNodable = document.createElement('button');
    updateNodable.innerText = 'Atom to Nodable';
    updateNodable.addEventListener("click", () => this.updateNodable() );
    this.mainDiv.appendChild(updateNodable);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.addEventListener("click", () => this.close() );
    this.mainDiv.appendChild(closeBtn);

    // Update title when active pane item changes
    this.subscriptions = atom.workspace.getCenter()
    .observeActivePaneItem(item =>
      {
        if (!atom.workspace.isTextEditor(item))
        {
          this.titleDiv.innerText = 'Open a file to see important information about it.';
          return;
        }

        this.titleDiv.innerHTML = `<h5>Nodable Editor | (${item.getFileName() || 'untitled'})</h5>`;
      }
    );

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  setText(_text)
  {
    this.textBuffer = _text;
    this.textInput.value = _text;
  }

  updateAtom()
  {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor)
    {
      if ( this.textInput.value )
      {
        editor.insertText(this.textInput.value, {select: true});
      }
    }
  }

  updateNodable()
  {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor)
    {
      const txt = editor.getSelectedText();

      if ( txt )
      {
        this.setText(txt);
      }
      else
      {
        const position = editor.getCursorBufferPosition();
        const lineText = editor.lineTextForBufferRow(position.row);
        this.setText(lineText);
      }
    }
  }

  close()
  {
    atom.commands.dispatch( this.element,  'nodable:toggle');
  }

  isVisible()
  {
    return this.visible;
  }

  show()
  {
    this.visible = true;
    this.element.hidden = false;
  }

  hide()
  {
    this.visible = false;
    this.element.hidden = true;
  }
}
