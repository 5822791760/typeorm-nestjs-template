export interface PostData {
  title: string;
  details: string;
  createdBy: number;
}

export interface NewPost extends PostData {
  createdAt: Date;
  updatedAt: Date;
}
