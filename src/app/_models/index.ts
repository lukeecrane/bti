import {User} from './user';
export class Redirect {
  _id: number;
  title:string;
}
export class Scripture {
  _id: number;
  verse: string;
  KJV_text: string;
  entireKJV_text: string;
  redirect_title:string;
}
export class Sub {
  _id: number;
  sub_heading: string;
  scriptures: Scripture[];
  redirect_topics: Redirect[];
  main_heading: string;  //Computer generated results
  displayed_redirect:Index; //Computer generated Redirect

}
export class Index {
  _id: number;
  main_heading: string;
  scriptures: Scripture[];
  redirect_topics: Redirect[];
  subs:Sub[];
  status: string;
  createdAt: string;
  slug: string;
  author: User[];
  version: number;
  time: string;
  hidden:boolean;
  expand:boolean;
  deleted:boolean;
  displayed_sub: Sub;  //Just for display on screen
  displayed_redirect:Index;  //Just for display on screen
}
