import {manageSales} from './manageSales.js'

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
export const manageNolwCod = (initdate, findate, prodotto, codice)=>
        {
            const data = {
                codiceprodotto : prodotto
            }
            let prod = await $.get('/getProdById', data);
            let occupato = false;
            let prezzo = 0;
            for(var e in prod.magazzino)
            {
                var data_in = initdate.split('-');
                var data_fin = findate.split('-');
                var data_richiesta = getDates(new Date(data_in[0], data_in[1]-1, data_in[2]), new Date(data_fin[0], data_fin[1]-1, data_fin[2]));
                if(prod.magazzino[e].codice == codice)
                {
                    for(var d in prod.magazzino[e].nondisp)
                    {
                        var data_occ = prod.magazzino[e].nondisp[d].split(',');
                        var data_occ_in = data_occ[0].split('-');
                        var data_occ_fin = data_occ[1].split('-');
                        var data_occupata = getDates(new Date(data_occ_in[0], data_occ_in[1]-1, data_occ_in[2]), new Date(data_occ_fin[0], data_occ_fin[1]-1, data_occ_fin[2]));
                    
                        for(var r in data_richiesta){
                            for (var o in data_occupata){
                                if(data_richiesta[r].toString() == data_occupata[o].toString()){
                                    occupato = true;
                                }
                            }
                            }
                    }
                    
                    if(prod.sconti!=undefined){
                        prezzo = manageSales(data_richiesta, prod.magazzino[e], prod);
                    }
                    else{
                        prezzo = parseFloat(prod.magazzino[e].prezzo) * data_richiesta.length;
                    }
                }
            }
            if(occupato == true)
            {
                return [prezzo, 'Il prodotto è già occupato nelle date da lei inserite. Si consiglia di cambiare date.\nSe vuole comunque proseguire, si ricordi di modificare le altre prenotazioni'];
            }
            else{
                return [prezzo, 'Libero'];
            }
        }