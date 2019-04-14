import { NgModule } from '@angular/core';
import { IconCamera, IconHeart, IconDelete, IconEdit,IconPlusCircle,IconBook,IconX } from 'angular-feather';

const icons = [
  IconCamera,
  IconHeart,
  IconDelete,
  IconEdit,
  IconPlusCircle,
  IconBook,
  IconX
];

@NgModule({
  imports: icons,
  exports: icons
})
export class IconsModule { }
