/**
 * Created by fazbat on 3/16/2016.
 */

"use strict";

const recipes = [
    {
        id:"rcp1" + Date.now().toString(32), //unique key
        title:"Braised Corned Beef Brisket",
        ingredients:[
            {id:"ing1" + Date.now().toString(32),text:"1 (5 pound) flat-cut corned beef brisket"},
            {id:"ing2" + Date.now().toString(32),text:"1 tablespoon browning sauce (such as Kitchen Bouquet®), or as desired"},
            {id:"ing3" + Date.now().toString(32),text:"1 tablespoon vegetable oil"},
            {id:"ing4" + Date.now().toString(32),text:"1 onion, sliced"},
            {id:"ing5" + Date.now().toString(32),text:"6 cloves garlic, sliced"},
            {id:"ing6" + Date.now().toString(32),text:"2 tablespoons water"}
        ],
        directions:"Preheat oven to 275 degrees F (135 degrees C).Discard any flavoring packet from corned beef." +
        " Brush brisket with browning sauce on both sides. Heat vegetable oil in a large skillet over medium-high heat " +
        "and brown brisket on both sides in the hot oil, 5 to 8 minutes per side.Place brisket on a rack set in" +
        " a roasting pan. Scatter onion and garlic slices over brisket and add water to roasting pan. Cover pan " +
        "tightly with aluminum foil. Roast in the preheated oven until meat is tender, about 6 hours."
    },
    {
        id:"rcp2" + Date.now().toString(32), //unique key
        title:"Mozzarella Chicken",
        ingredients:[
            {id:"ing1" + Date.now().toString(32),text:"4 skinless, boneless chicken breast halves - pounded to 1/4 inch thickness"},
            {id:"ing2" + Date.now().toString(32),text:"1 cup prepared basil pesto"},
            {id:"ing3" + Date.now().toString(32),text:"4 thick slices mozzarella cheese"},
            {id:"ing4" + Date.now().toString(32),text:"cooking spray"}
        ],
        directions:"Preheat the oven to 350 degrees F (175 degrees C). Spray a baking dish with cooking spray." +
        "Spread 2 to 3 tablespoons of the pesto sauce onto each flattened chicken breast. Place one slice of " +
        "cheese over the pesto. Roll up tightly, and secure with toothpicks. Place in a lightly greased baking " +
        "dish. Bake uncovered for 45 to 50 minutes in the preheated oven, until chicken is nicely browned and " +
        "juices run clear."
    }
];
const blankRecipe = {
    id:null,
    title:null,
    ingredients:[
        /*{id:_.uniqueId('ing'),text:"1 ingrdient"},
        {id:_.uniqueId('ing'),text:"2 ingreient"},
        {id:_.uniqueId('ing'),text:"3 ingreient"}*/
    ],
    directions:""
};

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            recipes: localStorage.getItem("recipes")? JSON.parse(localStorage.getItem("recipes")): recipes
        };
    }

    render() {
            console.log(this.state.recipes);
        return (
            <div className="col-sm-8 col-sm-offset-2 recipe-book">
                <div className="header"><h1>My Recipes</h1></div>
                <RecipeList
                    recipes={this.state.recipes}
                    deleteRecipe={(id)=>{this.deleteRecipe(id)}}
                    saveRecipe={(recipe,callback)=>{this.saveRecipe(recipe,callback)}}/>
                <div className="recipe-book-footer"><AddEditRecipeButton
                    buttonText="Add Recipe"
                    modalId="newRecipeButton"
                    addRecipe={(recipe,callback)=>{this.addRecipe(recipe,callback)}}
                    recipe={blankRecipe}/></div>
            </div>
        );
    }

    addRecipe(recipe,callback){
        if(!recipe.id){recipe.id = "rcp_" + Date.now().toString(32)}//unique key
        this.saveRecipe(recipe,callback);
    }
    deleteRecipe(id){
        let newRecipeList = _.cloneDeep(this.state.recipes);
        newRecipeList = newRecipeList.filter((listedRecipe)=>{    //filter outduplicate if updateing
            return id != listedRecipe.id;
        });
        this.setState({recipes:newRecipeList},()=>{
            localStorage.setItem('recipes', JSON.stringify(this.state.recipes));
        });

    }

    saveRecipe(recipe,callback){
        let newRecipeList = _.cloneDeep(this.state.recipes);
        newRecipeList = newRecipeList.filter((listedRecipe)=>{    //filter outduplicate if updateing
            return recipe.id != listedRecipe.id;
        });
        newRecipeList.push(recipe);
        this.setState({recipes:newRecipeList},()=>{
            localStorage.setItem('recipes', JSON.stringify(this.state.recipes));
            callback();
        });

    }
}

const RecipeList=(props)=>{
    let id = "accordion";
    let list = props.recipes.map((recipe)=>{
        return (
            <RecipePanel
                saveRecipe={(recipe,callback)=>{props.saveRecipe(recipe,callback)}}
                deleteRecipe={(id)=>{props.deleteRecipe(id)}}
                recipe={recipe}
                parent={id}
                key={recipe.id}/>
        );
    });

    return (
        <div className="panel-group" id={id} >
            {list}
        </div>
    );
};

const RecipePanel =(props)=>{
    return (
        <div className="panel panel-default" key={props.recipe.id}>
            <div className="panel-heading">
                <span className="panel-title">
                    <a
                        data-toggle="collapse"
                        data-parent={"#" + props.parent}
                        href={"#"+props.recipe.id}>
                        <h3>{props.recipe.title}</h3>
                    </a>
                </span>
            </div>
            <div id={props.recipe.id} className="panel-collapse collapse">
                <div className="panel-body">
                    <h4>Ingredients:</h4>
                    <IngredientList ingredients={props.recipe.ingredients}/>
                    <h4>Directions:</h4>
                    <RecipeDirections text={props.recipe.directions}/>
                </div>
                <div className="panel-footer clearfix">
                            <div className="pull-left">
                                <AddEditRecipeButton
                                    buttonText="Edit"
                                    modalId={"Edit" + props.recipe.id}
                                    addRecipe={(recipe,callback)=>{props.saveRecipe(recipe,callback)}}
                                    recipe={props.recipe}/>
                            </div>
                            <div className="pull-left">
                                <a
                                    onClick={()=>{props.deleteRecipe(props.recipe.id)}}
                                    className="btn btn-danger">
                                    Delete</a>
                            </div>
                </div>
            </div>

        </div>
    );
};

const IngredientList = (props)=>{
    let list = props.ingredients.map((ingredient,index)=>{
        return <li key={"key"+index}>{ingredient.text}</li>
    });

    return (
        <div>
            <ul>
                {list}
            </ul>
        </div>
    )
};

const RecipeDirections = (props)=>{
    return (
        <div>
            <p>{props.text}</p>
        </div>
    );
};

class AddEditRecipeButton extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            modalId:props.modalId,
            recipe: props.recipe,
            recipeChanged: false,
            newIngredientText: ""
        }
    }

    render() {
                            //todo: button text
        return (
            <div className="add-edit-recipe">
                <button type="button"
                        className="btn btn-default add-edit-btn"
                        data-toggle="modal"
                        data-target={"#" + this.state.modalId}>
                    {this.props.buttonText}
                </button>
                <RecipeModal
                    id={this.state.modalId}
                    newIngredientText={this.state.newIngredientText}
                    setNewIngredientText={(text)=>{this.setNewIngredientText(text)}}
                    recipeChanged={this.state.recipeChanged}
                    saveParentRecipe={()=>{this.saveParentRecipe()}}
                    updateTempRecipe={(key,item)=>{this.updateTempRecipe(key,item)}}
                    resetRecipe={()=>{this.resetRecipe()}}
                    recipe={this.state.recipe}/>
            </div>
        );
    }
    updateTempRecipe(key,item){
        let newRecipe = _.cloneDeep(this.state.recipe);
        newRecipe[key]= item;
        this.setState({

            recipe:newRecipe}
        )
    }
    saveParentRecipe(){
        this.props.addRecipe(this.state.recipe,()=>{
            this.setState({
                newIngredientText: "",
                recipeChanged: false,
                recipe: this.props.recipe});
        });
    }
    resetRecipe(){
        this.setState({
            newIngredientText: "",
            recipeChanged: false,
            recipe: this.props.recipe});
    }
    setNewIngredientText(text){
        this.setState({newIngredientText: text});
    }
}

const RecipeModal =(props)=> {

        return (
            <div className="modal fade" id={props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <EditableTitle
                                updateTempRecipe={(key,item)=>{props.updateTempRecipe(key,item)}}
                                title={props.recipe.title} />
                        </div>
                        <div className="modal-body">
                            <EditableIngredientList
                                setNewIngredientText={(text)=>{props.setNewIngredientText(text)}}
                                newIngredientText={props.newIngredientText}
                                updateTempRecipe={(key,item)=>{props.updateTempRecipe(key,item)}}//todo
                                recipeChanged={props.recipeChanged}
                                list={props.recipe.ingredients}/>
                            <EditableDirections
                                updateTempRecipe={(key,item)=>{props.updateTempRecipe(key,item)}}
                                directions={props.recipe.directions}
                            />
                        </div>

                        <div className="modal-footer">
                            <button
                                data-dismiss="modal"
                                onClick={()=>{props.saveParentRecipe(props.recipe)}}
                                className="btn btn-primary">
                                Save
                            </button>
                            <button
                                data-dismiss="modal"
                                onClick={()=>{props.resetRecipe()}}
                                className="btn btn-default">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

class EditableTitle extends React.Component{
    constructor(props) {
        super(props);
    }
    handleTextChange(event){
        this.props.updateTempRecipe("title",event.target.value);
        console.log(event);
    }

    render(){
        return(
            <div className="recipe-title">
                <input
                    onKeyUp={(e)=>{ if (e.keyCode == 13) {
                                        e.target.blur()
                                    }}}
                    onChange={(event)=>{this.handleTextChange(event)}}
                    value={this.props.title}
                    placeholder="Add Title&hellip;"/>
            </div>
        )
    }
}

class EditableIngredientList extends React.Component{
    constructor(props) {
        super(props);
    }

    getList(){
        return this.props.list.map((ingredient,index)=>{
            return (
                <EditableIngredient
                    updateIngredient={(id,text)=>{this.updateIngredient(id,text)}}
                    deleteIngredient={(id)=>{this.deleteIngredient(id)}}
                    key={ingredient.id}
                    ingredient={ingredient}/>
            )
        });
    }
    handleNewIngredientTextChange(event){
        this.props.setNewIngredientText(event.target.value)
    }
    handleAddIngredient(text) {
        let newIngredient = {id:"ing_" + Date.now().toString(32), text: text};
        let newIngredientList = _.cloneDeep(this.props.list);
        newIngredientList.push(newIngredient);
        this.props.updateTempRecipe("ingredients", newIngredientList);
        this.props.setNewIngredientText("")
    }
    updateIngredient(id,text){
        let newIngredientList = _.cloneDeep(this.props.list);
        newIngredientList = newIngredientList.map(function(item){
            if(item.id == id){return {id:id, text: text}}
            return item
        });
        this.props.updateTempRecipe("ingredients", newIngredientList);
    }
    deleteIngredient(id){
        let newIngredientList = _.cloneDeep(this.props.list);
        newIngredientList = newIngredientList.filter(function(item){
            return !(item.id == id)
        });
        this.props.updateTempRecipe("ingredients", newIngredientList);
    }

    render() {
        console.log("changed", this.props.recipeChanged);
        return (
            <div>
                <h4>Ingredients:</h4>
                <div>{this.getList()}</div>
                <div className="input-group new-ing-input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={this.props.newIngredientText}
                        onChange={(event)=>{this.handleNewIngredientTextChange(event)}}
                        placeholder="Add Ingredient&hellip;"/>
                    <span className="input-group-btn">
                        <button
                            type="button"
                            onClick={()=>{this.handleAddIngredient(this.props.newIngredientText)}}
                            className="btn btn-info">
                            Add</button>
                    </span>
                </div>
            </div>
        )
    }


}

class EditableIngredient extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            text:props.ingredient.text,
            id: props.ingredient.id,
            changed:false
        }
    }

    handleTextChange(event){
        this.setState({
            text:event.target.value,
            changed: true
        })
    }

    handleTextBlur(event){
        if(this.state.changed) {
            this.props.updateIngredient(this.state.id, this.state.text);
        }
        this.setState({changed:false})
    }
    handleDeleteClick(){
        console.log("handleDeleteClick, state.id=", this.state.id);
        this.props.deleteIngredient(this.state.id);
    }

    render(){
        return (
            <div className="input-group ingredient">
                <input
                    type="text"
                    className="form-control"
                    onChange={(event)=>{this.handleTextChange(event)}}
                    onBlur={(event)=>{this.handleTextBlur(event)}}
                    value={this.state.text}/>
                    <span className="input-group-btn">
                        <button
                            type="button"
                            onClick={()=>{this.handleDeleteClick()}}
                            className="btn btn-danger">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                    </span>
            </div>
        )
    }
}

class EditableDirections extends React.Component{
    constructor(props) {
        super(props);

    }

    handleTextChange(event){
        this.props.updateTempRecipe("directions",event.target.value);
    }

    render(){
        return(
            <div className="directions">
                <h4>Directions:</h4>
                <form>

                        <textarea
                            className="form-control"
                            onChange={(event)=>{this.handleTextChange(event)}}
                            value={this.props.directions}
                            placeholder="Add Directions&hellip;"/>

                </form>
            </div>
        )
    }

}

ReactDOM.render(<App />, document.querySelector(".main"));
