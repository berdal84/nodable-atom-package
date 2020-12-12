'use babel';

export default class NodableView {

  constructor(serializedState)
  {
    this.textBuffer = null;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('nodable');

    // Create message element
    const mainDiv = document.createElement('div');
    this.element.appendChild(mainDiv);

    // Div to display nodable buffer
    this.textInput = document.createElement('input');
    this.textInput.type = 'textarea'
    this.textInput.rows = 10;
    this.textInput.cols = 50;
    this.textInput.readOnly = false;
    this.element.appendChild(this.textInput);

    // Update Atom button
    const updateAtom = document.createElement('button');
    updateAtom.innerText = 'Nodable to Atom';
    updateAtom.addEventListener("click", () => this.updateAtom() );
    this.element.appendChild(updateAtom);

    // Update Nodable button
    const updateNodable = document.createElement('button');
    updateNodable.innerText = 'Atom to Nodable';
    updateNodable.addEventListener("click", () => this.updateNodable() );
    this.element.appendChild(updateNodable);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerText = 'Close';
    closeBtn.addEventListener("click", () => this.close() );
    this.element.appendChild(closeBtn);

    // Update mainDiv when active pane item changes
    this.subscriptions = atom.workspace.getCenter()
    .observeActivePaneItem(item =>
      {
        if (!atom.workspace.isTextEditor(item))
        {
          mainDiv.innerText = 'Open a file to see important information about it.';
          return;
        }

        mainDiv.innerHTML = `<h5>Nodable Editor | (${item.getFileName() || 'untitled'})</h5>`;
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

}
