import { CanDeactivateFn } from '@angular/router';


export interface CanComponentDeactivate {

  canDeactivate: () => boolean;
}


export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {

  if (component.canDeactivate()) {
    return true;
  }

  return confirm(
    'Você possui alterações não salvas. Deseja realmente sair da página?'
  );
};
