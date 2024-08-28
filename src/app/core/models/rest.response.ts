export interface RestResponse<T> {
  pages? : number[],
  currentPage? : number,
  PreviousPage? : number,
  nextPage? : number,
  itemsItems? : number[],
  totalPages? : number,
  results : T,
  statuts : number
}
