'use babel';

import NodableView from './nodable-view';
import { CompositeDisposable } from 'atom';

export default {

  nodableView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.nodableView = new NodableView(state.nodableViewState);
    this.modalPanel = atom.workspace.addBottomPanel({
      item: this.nodableView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'nodable:toggle': () => this.toggle()
    }));

  },

  deactivate() {
    this.modalPanel.destroy();
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

    if ( !this.modalPanel.isVisible() )
    {
      this.nodableView.updateNodable();
      return this.modalPanel.show();
    }

    this.nodableView.updateAtom();
    return this.modalPanel.hide();

  }

};
