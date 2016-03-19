/**
 * Created by fazbat on 3/16/2016.
 */

"use strict";

const recipes = [
    {
        id:_.uniqueId('rcp'),
        title:"Braised Corned Beef Brisket",
        ingredients:[
            {id:_.uniqueId('ing'),text:"1 (5 pound) flat-cut corned beef brisket"},
            {id:_.uniqueId('ing'),text:"1 tablespoon browning sauce (such as Kitchen Bouquet®), or as desired"},
            {id:_.uniqueId('ing'),text:"1 tablespoon vegetable oil"},
            {id:_.uniqueId('ing'),text:"1 onion, sliced"},
            {id:_.uniqueId('ing'),text:"6 cloves garlic, sliced"},
            {id:_.uniqueId('ing'),text:"2 tablespoons water"}
        ],
        directions:"Preheat oven to 275 degrees F (135 degrees C).Discard any flavoring packet from corned beef." +
        " Brush brisket with browning sauce on both sides. Heat vegetable oil in a large skillet over medium-high heat " +
        "and brown brisket on both sides in the hot oil, 5 to 8 minutes per side.Place brisket on a rack set in" +
        " a roasting pan. Scatter onion and garlic slices over brisket and add water to roasting pan. Cover pan " +
        "tightly with aluminum foil. Roast in the preheated oven until meat is tender, about 6 hours."
    },
    {
        id:_.uniqueId('rcp_'),
        title:"Mozzarella Chicken",
        ingredients:[
            {id:_.uniqueId('ing'),text:"4 skinless, boneless chicken breast halves - pounded to 1/4 inch thickness"},
            {id:_.uniqueId('ing'),text:"1 cup prepared basil pesto"},
            {id:_.uniqueId('ing'),text:"4 thick slices mozzarella cheese"},
            {id:_.uniqueId('ing'),text:"cooking spray"}
        ],
        directions:"Preheat the oven to 350 degrees F (175 degrees C). Spray a baking dish with cooking spray." +
        "Spread 2 to 3 tablespoons of the pesto sauce onto each flattened chicken breast. Place one slice of " +
        "cheese over the pesto. Roll up tightly, and secure with toothpicks. Place in a lightly greased baking " +
        "dish. Bake uncovered for 45 to 50 minutes in the preheated oven, until chicken is nicely browned and " +
        "juices run clear."
    }
];
const blankRecipe = {
    id:'',
    title:"Title of Recipe",
    ingredients:[
        {id:_.uniqueId('ing'),text:"1 ingrdient"},
        {id:_.uniqueId('ing'),text:"2 ingreient"},
        {id:_.uniqueId('ing'),text:"3 ingreient"}
    ],
    directions:"directions for recipe"
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
            <div>
                <RecipeList recipes={this.state.recipes} saveRecipe={(recipe)=>{this.saveRecipe(recipe)}}/>
                <AddRecipeButton addRecipe={(recipe)=>{this.addRecipe(recipe)}} recipe={blankRecipe}/>
            </div>
        );
    }

    addRecipe(recipe){
        recipe.id = _.uniqueId('rcp_');
        this.saveRecipe(recipe);
    }

    saveRecipe(recipe){
        let newRecipeList = _.cloneDeep(this.state.recipes);
        newRecipeList.push(recipe);
        this.setState({recipes:newRecipeList},()=>{
            localStorage.setItem('recipes', JSON.stringify(this.state.recipes));
        });

    }
}

const RecipeList=(props)=>{
    let id = "accordion";
    let list = props.recipes.map((recipe)=>{
        return (
            <RecipePanel recipe={recipe} parent={id} key={recipe.id}/>
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
                <h4 className="panel-title">
                    <a
                        data-toggle="collapse"
                        data-parent={"#" + props.parent}
                        href={"#"+props.recipe.id}>
                        {props.recipe.title}
                    </a>
                </h4>
            </div>
            <div id={props.recipe.id} className="panel-collapse collapse">
                <div className="panel-body">
                    <IngredientList ingredients={props.recipe.ingredients}/>
                    <RecipeDirections text={props.recipe.directions}/>
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

class AddRecipeButton extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            dataTarget:"newRecipeModal",
            recipe: props.recipe
        }
    }

    render() {
                            //todo: button text
        return (
            <div>
                <button type="button"
                        className="btn btn-primary btn-lg"
                        data-toggle="modal"
                        data-target={"#" + this.state.dataTarget}>
                    Add(edit) Recipe
                </button>
                <RecipeModal
                    id={this.state.dataTarget}
                    addRecipe={(recipe)=>{props.addRecipe(recipe)}}
                    updateTempRecipe={(key,item)=>{this.updateTempRecipe(key,item)}}
                    recipe={this.state.recipe}/>
            </div>
        );
    }
    updateTempRecipe(key,item){
        let newRecipe = _.cloneDeep(this.state.recipe);
        newRecipe[key]= item;
        this.setState({recipe:newRecipe})
    }
}

const RecipeModal =(props)=> {

        return (
            <div className="modal fade" id={props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">{props.recipe.title}</div>
                        <div className="modal-body">
                            <EditableIngredientList
                                updateTempRecipe={(key,item)=>{props.updateTempRecipe(key,item)}}//todo
                                list={props.recipe.ingredients}/>
                        </div>
                        <div>
                            Directions: {props.recipe.directions}
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={()=>{props.addRecipe(newRecipe)}}
                                className="btn btn-default">
                                Save
                            </button>
                            <button
                                onClick={()=>{props.addRecipe(newRecipe)}}
                                className="btn btn-default">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };




class EditableIngredientList extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            newRecipeText:"",
            textChanged: false
        }
    }

    getList(){
        return this.props.list.map(function(ingredient,index){
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
        this.setState({
            newRecipeText: event.target.value,
            textChanged: true
        })
    }
    handleAddButtonClick(){
        let text = this.state.newRecipeText;
        this.setState({newRecipeText:""});
        this.addIngredient(text);
    }

    addIngredient(text) {
        let newIngredient = {id: _.uniqueId('ing'), text: text};
        let newIngredientList = _.cloneDeep(this.props.list);
        newIngredientList.push(newIngredient);
        this.props.updateTempRecipe("ingredients", newIngredientList)
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
        return (
            <div>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        value={this.state.newRecipeText}
                        onChange={(event)=>{this.handleNewIngredientTextChange(event)}}
                        placeholder="Add Ingredient&hellip;"/>
                    <span className="input-group-btn">
                        <button
                            type="button"
                            onClick={()=>{this.handleAddButtonClick()}}
                            className="btn btn-default">
                            Add</button>
                    </span>
                </div>
                <div>{this.getList()}</div>
            </div>
        )
    }


}

class EditableIngredient extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            text:props.ingrdient.text,
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

    }

    render(){
        return (
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    onChange={(event)=>{this.handleTextChange(event)}}
                    onBlur={(event)=>{this.handleTextBlur(event)}}
                    value={this.state.text}/>
                    <span className="input-group-btn">
                        <button
                            type="button"
                            className="btn btn-default">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        </button>
                    </span>
            </div>
        )
    }
}






    ReactDOM.render(<App />, document.querySelector(".main"));
