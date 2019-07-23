import { actionTypes } from "./defs";

export const openModal = modalName => ({
  type: actionTypes.onOpenModal,
  value: modalName,
});

export const closeModal = modalName => ({
  type: actionTypes.onCloseModal,
  value: modalName,
});
