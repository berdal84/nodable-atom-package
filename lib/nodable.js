'use babel';

import NodableView from './nodable-view';
import { CompositeDisposable } from 'atom';

export default {

  nodableView: null,
  subscriptions: null,

  activate(state) {
    this.nodableView = new NodableView(state.nodableViewState);

    const textEditor = atom.workspace.getActiveTextEditor();
    const textEditorElement = atom.views.getView(textEditor);
    textEditorElement.appendChild( this.nodableView.getElement() );

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'nodable:toggle': () => this.toggle()
    }));

  },

  deactivate()
  {
    this.subscriptions.dispose();
    this.nodableView.destroy();
  },

  serialize() {
    return {
      nodableViewState: this.nodableView.serialize()
    };
  },

  toggle() {

    console.log('Nodable was toggled!');

    if ( !this.nodableView.isVisible() )
    {
      this.nodableView.updateNodable();
      return this.nodableView.show();
    }

    this.nodableView.updateAtom();
    return this.nodableView.hide();

  }

};
