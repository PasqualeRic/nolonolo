import manageSales from './manageSales'

function min(arg){
    let temp = 9999999;
    let minProd = '';
    let indexProd = 0;
    for(var i in arg.magazzino){
        if(temp >= parseFloat(arg.magazzino[i].prezzo))
        {
            temp = parseFloat(arg.magazzino[i].prezzo);
            indexProd = i;
            minProd = arg.magazzino[i];
        }
    }
    return [indexProd,minProd]
}

function getDates (startDate, endDate) {
    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
    while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
    }
    return dates
}


const manageNol = (initdate, findate, prodotto) => {
    //creo la data della richiesta
    var tempProd = JSON.parse(JSON.stringify(prodotto));
    var data_in = initdate.split('-');
    var data_fin = findate.split('-');
    var data_richiesta = getDates(new Date(data_in[0], data_in[1]-1, data_in[2]), new Date(data_fin[0], data_fin[1]-1, data_fin[2]));

    let occupato = true;
    let text = '';
    let c = 0;

    console.log(tempProd.magazzino);
    //controllo che il prodotto sia disponibile
    while(c < tempProd.magazzino.length && occupato === true && tempProd.magazzino !== ''){
        //prendo l'oggetto in magazzino con il prezzo più basso
        const returns = min(tempProd);
        const index = returns[0];
        const minProd = returns[1];
        occupato = false;
        for(var el in minProd.nondisp){
            var data_occ = minProd.nondisp[el].split(',');
            var data_occ_in = data_occ[0].split('-');
            var data_occ_fin = data_occ[1].split('-');
            var data_occupata = getDates(new Date(data_occ_in[0], data_occ_in[1]-1, data_occ_in[2]), new Date(data_occ_fin[0], data_occ_fin[1]-1, data_occ_fin[2]));
            for(var r in data_richiesta){
                for (var o in data_occupata){
                    if(data_richiesta[r].toString() === data_occupata[o].toString()){
                        occupato = true;
                    }
                }
                }
            }
            if(occupato == true)
            {
                tempProd.magazzino.splice(index, 1);
                text = 'In base alle date da lei selezionate, il prezzo potrebbe aumentare';
            }
            else{
                let prezzo = 0;
                if(tempProd.sconti!==undefined && tempProd.sconti.length !== 0){
                    prezzo = manageSales(data_richiesta, minProd, tempProd);
                }
                else{
                    prezzo = parseFloat(minProd.prezzo) * data_richiesta.length;
                }
                return [text, prezzo, minProd.codice, data_richiesta];
            }
        }
        if(tempProd.magazzino === '' || tempProd.magazzino.length === 0)
        {
            return 'nondisp';
        }

};

export default manageNol;