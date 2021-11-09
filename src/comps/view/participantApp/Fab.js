const Fab = () => {
	//Fixed action button for additional explanation during dce
    return ( 
        <div className="outtro">
			<div className="fixed-action-btn">
				<a href="#modal1" className=" modal-trigger btn-floating red darken-2">
					<i className="material-icons mat-icon" style={{fontSize: '140%'}} >help_outline</i></a>
			</div>
		</div>
     );
}
 
export default Fab;