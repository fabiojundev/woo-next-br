import PropTypes from 'prop-types';
import {memo} from 'react';
import cx from 'classnames';

import Abbr from "./form-elements/Abbr";
import Error from './Error';

const brStates = [
    {
        stateCode: 'AC',
        stateName: 'Acre',
    },
    {
        stateCode: 'AL',
        stateName: 'Alagoas',
    },
    {
        stateCode: 'AM',
        stateName: 'Amazonas',
    },
    {
        stateCode: 'AP',
        stateName: 'Amapá',
    },
    {
        stateCode: 'BA',
        stateName: 'Bahia',
    },
    {
        stateCode: 'CE',
        stateName: 'Ceará',
    },
    {
        stateCode: 'DF',
        stateName: 'Distrito Federal',
    },
    {
        stateCode: 'ES',
        stateName: 'Espírito Santo',
    },
    {
        stateCode: 'GO',
        stateName: 'Goiás',
    },
    {
        stateCode: 'MA',
        stateName: 'Maranhão',
    },
    {
        stateCode: 'MT',
        stateName: 'Mato Grosso',
    },
    {
        stateCode: 'MS',
        stateName: 'Mato Grosso do Sul',
    },
    {
        stateCode: 'MG',
        stateName: 'Minas Gerais',
    },
    {
        stateCode: 'PA',
        stateName: 'Pará',
    },
    {
        stateCode: 'PB',
        stateName: 'Paraíba',
    },
    {
        stateCode: 'PR',
        stateName: 'Paraná',
    },
    {
        stateCode: 'PE',
        stateName: 'Pernambuco',
    },
    {
        stateCode: 'PI',
        stateName: 'Piauí',
    },
    {
        stateCode: 'RJ',
        stateName: 'Rio de Janeiro',
    },
    {
        stateCode: 'RN',
        stateName: 'Rio Grande do Norte',
    },
    {
        stateCode: 'RS',
        stateName: 'Rio Grande do Sul',
    },
    {
        stateCode: 'RO',
        stateName: 'Rondônia',
    },
    {
        stateCode: 'RR',
        stateName: 'Roraima',
    },
    {
        stateCode: 'SC',
        stateName: 'Santa Catarina',
    },
    {
        stateCode: 'SP',
        stateName: 'São Paulo',
    },
    {
        stateCode: 'SE',
        stateName: 'Sergipe',
    },
    {
        stateCode: 'TO',
        stateName: 'Tocantins',
    },
];

const StateSelection = ({handleOnChange, input, states, isFetchingStates, isShipping}) => {

    const {state, errors} = input || {};

    const inputId = `state-${isShipping ? 'shipping' : 'billing'}`;

    if (isFetchingStates) {
        // Show loading component.
        return (
            <div className="mb-3">
                <label className="leading-7 text-sm text-gray-700">
                    Estado
                    <Abbr required/>
                </label>
                <div className="relative w-full border-none">
                    <select
                        disabled
                        value=""
                        name="state"
                        className="opacity-50 bg-gray-100 bg-opacity-50 border border-gray-500 text-gray-500 appearance-none inline-block py-3 pl-3 pr-8 rounded leading-tight w-full"
                    >
                        <option value="">Carregando...</option>
                    </select>
                </div>
            </div>
        )
    }
    states = brStates;

    if (!states.length) {
        return null;
    }

    return (
        <div className="mb-3">
            <label className="leading-7 text-sm text-gray-600" htmlFor={inputId}>
                Estado
                <Abbr required/>
            </label>
            <div className="relative w-full border-none">
                <select
                    disabled={isFetchingStates}
                    onChange={handleOnChange}
                    value={state}
                    name="state"
                    className={cx(
                        'bg-gray-100 bg-opacity-50 border border-gray-400 text-gray-500 appearance-none inline-block py-3 pl-3 pr-8 rounded leading-tight w-full',
                        {'opacity-50': isFetchingStates}
                    )}
                    id={inputId}
                >
                    <option value="">Selecione o Estado...</option>
                    {states.map((state, index) => (
                        <option key={state?.stateCode ?? index} value={state?.stateCode ?? ''}>
                            {state?.stateName}
                        </option>
                    ))}
                </select>
            </div>
            <Error errors={errors} fieldName={'state'}/>
        </div>
    )
}

StateSelection.propTypes = {
    handleOnChange: PropTypes.func,
    input: PropTypes.object,
    states: PropTypes.array,
    isFetchingStates: PropTypes.bool,
    isShipping: PropTypes.bool
}

StateSelection.defaultProps = {
    handleOnChange: () => null,
    input: {},
    states: [],
    isFetchingStates: false,
    isShipping: true
}

export default memo(StateSelection);
