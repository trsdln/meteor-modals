import { BootstrapModalPlugin } from './BootstrapModalPlugin';
import { ModalManager } from './modal-manager/ModalManager';

import './modal-manager/modal-manager';


ModalManager.registerPlugin('bootstrap', BootstrapModalPlugin);

export { ModalManager };
